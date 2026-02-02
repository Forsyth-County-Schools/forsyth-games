'use client'

import { useEffect } from 'react'

/**
 * ExtensionBlocker Component
 * 
 * Blocks browser extensions and monitoring/filtering services from:
 * - Linewize, Qoria, Classwize, Smoothwall, FamilyZone
 * - Screen sharing, remote control, and classroom management tools
 * - Unauthorized extension injections
 * 
 * This protects the website from third-party interference while maintaining
 * normal site functionality and allowing game content.
 * Does NOT bypass OS/network-level filters.
 * 
 * Performance optimized: Defers execution until after initial page load
 */

// Blocked domains - monitoring/filtering/classroom management services
const BLOCKED_DOMAINS = [
  'familyzone.com',
  'familyzone.com.au',
  'familyzone.io',
  'familyzone.tools',
  'linewize.com',
  'linewize.io',
  'linewize.net',
  'linewizereseller.net',
  'qoria.com',
  'qoria.cloud',
  'qoriaapis.cloud',
  'qoria-api.cloud',
  'smoothwall.com',
  'smoothwall.cloud',
  'sphirewall.net',
  'block.tools',
  'fzbox.tools',
  'home.tools',
  'ably.io',
  'ably-realtime.com',
  'xirsys.com',
  'stream-io-api.com',
  'stream-io-video.com',
  'stream-io-cdn.com',
  'getstream.io',
  'educatorimpact.com',
  'zdassets.com',
  'eipulse.zendesk.com'
]

// Game-related domains that should be allowed
const ALLOWED_GAME_DOMAINS = [
  'gms.parcoil.com',
  'cdn.jsdelivr.net',
  'github.com',
  'raw.githubusercontent.com'
]

export default function ExtensionBlocker() {
  // Allow injected content and monitoring for development
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  useEffect(() => {
    // Skip blocking in development mode
    if (isDevelopment) {
      console.info('[Security] Extension blocker disabled in development mode')
      return
    }
    
    // Defer blocking setup until after initial render to improve FCP/LCP
    const timeoutId = setTimeout(() => {
      setupBlocking()
    }, 100) // Small delay to not block initial paint

    return () => clearTimeout(timeoutId)
  }, [isDevelopment])

  return null // This component doesn't render anything
}

// Blocking setup - runs after initial page load
function setupBlocking() {
  // Check if URL contains blocked domain (including subdomains)
  const isBlockedUrl = (url: string): boolean => {
    try {
      const urlLower = url.toLowerCase()
      
      // Allow game-related domains
      if (ALLOWED_GAME_DOMAINS.some(domain => urlLower.includes(domain))) {
        return false
      }
      
      return BLOCKED_DOMAINS.some(domain => 
        urlLower.includes(domain) || 
        urlLower.includes('chrome-extension://') ||
        urlLower.includes('moz-extension://')
      )
    } catch {
      return false
    }
  }

  // Monitor DOM mutations for extension/service injections
  const detectInjections = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element
            
            // Check for monitoring service and extension indicators
            const indicators = [
              'data-extension',
              'chrome-extension',
              'extension-injected',
              'ext-',
              'classwize',
              'linewize',
              'qoria',
              'familyzone',
              'smoothwall',
              'screencast',
              'screen-share'
            ]
            
            // Game-related attributes that should be allowed
            const gameIndicators = [
              'game-',
              'gms.parcoil.com',
              'game-container',
              'game-iframe',
              'game-content'
            ]
            
            const hasIndicator = indicators.some(indicator => {
              const className = element.className
              const classNameStr = typeof className === 'string' ? className : ''
              return (
                classNameStr.includes(indicator) ||
                element.id?.includes(indicator) ||
                element.hasAttribute(indicator) ||
                (element.shadowRoot && element.shadowRoot.innerHTML.includes(indicator))
              )
            })
            
            // Allow game-related content
            const isGameContent = gameIndicators.some(indicator => {
              const className = element.className
              const classNameStr = typeof className === 'string' ? className : ''
              return (
                classNameStr.includes(indicator) ||
                element.id?.includes(indicator) ||
                element.hasAttribute(indicator) ||
                (element.shadowRoot && element.shadowRoot.innerHTML.includes(indicator))
              )
            })
            
            // Remove injected elements from monitoring services, but allow game content
            if (hasIndicator && !isGameContent) {
              element.remove()
              if (process.env.NODE_ENV === 'development') {
                console.warn('[Security] Blocked injected element')
              }
            }
          }
        })
      })
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'data-extension']
    })

    return observer
  }

  // Block fetch requests to monitoring services
  const blockFetch = () => {
    const originalFetch = window.fetch
    window.fetch = function(...args) {
      const url = args[0]?.toString() || ''
      if (isBlockedUrl(url)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Security] Blocked fetch request to:', url)
        }
        return Promise.reject(new Error('Request blocked by security policy'))
      }
      return originalFetch.apply(this, args)
    }
  }

  // Block XMLHttpRequest to monitoring services
  const blockXHR = () => {
    const originalXHR = window.XMLHttpRequest
    const originalOpen = originalXHR.prototype.open
    originalXHR.prototype.open = function(method: string, url: string | URL, ...rest: unknown[]) {
      const urlString = url.toString()
      if (isBlockedUrl(urlString)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Security] Blocked XHR request to:', urlString)
        }
        throw new Error('Request blocked by security policy')
      }
      return originalOpen.apply(this, [method, url, ...rest] as Parameters<typeof originalOpen>)
    }
  }

  // Block WebSocket connections to monitoring services
  const blockWebSocket = () => {
    const OriginalWebSocket = window.WebSocket
    window.WebSocket = new Proxy(OriginalWebSocket, {
      construct(target, args) {
        const url = args[0]?.toString() || ''
        if (isBlockedUrl(url)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Security] Blocked WebSocket connection to:', url)
          }
          throw new Error('WebSocket blocked by security policy')
        }
        return new target(...(args as [string | URL, string | string[] | undefined]))
      }
    })
  }

  // Block EventSource (Server-Sent Events) to monitoring services
  const blockEventSource = () => {
    const OriginalEventSource = window.EventSource
    window.EventSource = new Proxy(OriginalEventSource, {
      construct(target, args) {
        const url = args[0]?.toString() || ''
        if (isBlockedUrl(url)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Security] Blocked EventSource connection to:', url)
          }
          throw new Error('EventSource blocked by security policy')
        }
        return new target(...(args as [string, EventSourceInit | undefined]))
      }
    })
  }

  // Disable WebRTC for screen sharing prevention
  const disableWebRTC = () => {
    if (window.RTCPeerConnection) {
      const OriginalRTC = window.RTCPeerConnection
      window.RTCPeerConnection = new Proxy(OriginalRTC, {
        construct() {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Security] WebRTC connection blocked for security')
          }
          throw new Error('WebRTC is blocked by security policy')
        }
      })
    }
  }

  // Block getDisplayMedia (screen capture)
  const blockScreenCapture = () => {
    if (navigator.mediaDevices?.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = function() {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Security] Screen capture blocked')
        }
        return Promise.reject(new Error('Screen capture is blocked'))
      }
    }
  }

  // Block unauthorized postMessage
  const blockPostMessage = () => {
    window.addEventListener('message', (event) => {
      const origin = event.origin || ''
      if (isBlockedUrl(origin)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Security] Blocked postMessage from:', origin)
        }
        event.stopImmediatePropagation()
      }
    }, true)
  }

  // Block extension message passing
  const blockExtensionMessages = () => {
    // Type assertion for Chrome API
    const chromeAPI = (window as typeof window & { chrome?: { runtime?: { sendMessage?: unknown } } }).chrome
    if (chromeAPI?.runtime) {
      const original = chromeAPI.runtime.sendMessage
      if (original) {
        chromeAPI.runtime.sendMessage = function() {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Security] Extension messaging blocked')
          }
          return Promise.reject(new Error('Extension messaging is blocked'))
        }
      }
    }
  }

  // Initialize all blocking measures
  detectInjections() // Start DOM monitoring
  blockFetch()
  blockXHR()
  blockWebSocket()
  blockEventSource()
  disableWebRTC()
  blockScreenCapture()
  blockPostMessage()
  blockExtensionMessages()

  if (process.env.NODE_ENV === 'development') {
    console.info('[Security] Extension and monitoring service blocking enabled')
  }
}
