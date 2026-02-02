'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Send, Check, CheckCircle, AlertCircle } from 'lucide-react'
import FloatingNavigation from '@/components/FloatingNavigation'
import Footer from '@/components/Footer'

interface TabOption {
  id: string
  name: string
  faviconUrl: string
}

const tabOptions: TabOption[] = [
  {
    id: 'classlink',
    name: 'ClassLink',
    faviconUrl: '/classlink-logo.png'
  },
  {
    id: 'infinite-campus',
    name: 'Infinite Campus',
    faviconUrl: '/infinite-campus-logo.png'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    faviconUrl: '/google-drive-logo.png'
  }
]

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState<string>('classlink')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  
  // Game suggestion form state
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Load saved preference on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('preferredTab')
    if (savedTab) {
      setSelectedTab(savedTab)
    }
  }, [])

  // Apply tab name and favicon changes
  const applyTabSettings = (tabId: string) => {
    const option = tabOptions.find(opt => opt.id === tabId)
    if (!option) return

    // Save to localStorage
    localStorage.setItem('preferredTab', tabId)
    
    // Update document title
    document.title = `FCS | ${option.name}`
    
    // Update favicon
    const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement
    const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
    
    if (faviconLink) {
      faviconLink.href = option.faviconUrl
    }
    if (appleTouchIcon) {
      appleTouchIcon.href = option.faviconUrl
    }
    
    // Update meta tags
    const appNameMeta = document.querySelector("meta[name='application-name']")
    const appleMobileWebAppTitle = document.querySelector("meta[name='apple-mobile-web-app-title']")
    
    if (appNameMeta) {
      appNameMeta.setAttribute('content', `FCS | ${option.name}`)
    }
    if (appleMobileWebAppTitle) {
      appleMobileWebAppTitle.setAttribute('content', `FCS | ${option.name}`)
    }
  }

  const handleTabSelection = (tabId: string) => {
    setIsAnimating(true)
    setSelectedTab(tabId)
    applyTabSettings(tabId)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    // Use environment variable if available, fallback to hardcoded key
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'e93c5755-8acb-4e64-872b-2ba9d3b00e54'
    formData.append('access_key', accessKey)
    
    // Optional metadata fields
    formData.append('subject', 'New Game Suggestion from Forsyth Games')
    formData.append('from_name', 'Forsyth Games User')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      // Check if response is ok (status 200-299)
      if (!response.ok) {
        setStatus('error')
        setErrorMessage(`Server error: ${response.status}. Please try again.`)
        setTimeout(() => {
          setStatus('idle')
          setErrorMessage('')
        }, 3000)
        return
      }

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage('')
        // Reset form after 3 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('error')
        // Use API error message if available
        setErrorMessage(data.message || 'Failed to submit. Please try again.')
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setStatus('idle')
          setErrorMessage('')
        }, 3000)
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection.')
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-deep-space text-text-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="aurora-light aurora-1 hidden lg:block" />
      <div className="aurora-light aurora-2 hidden lg:block" />
      <div className="aurora-light aurora-3 hidden xl:block" />
      
      <FloatingNavigation 
        onSearchToggle={() => setIsSearchActive(!isSearchActive)}
        isSearchActive={isSearchActive}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass border border-white/10 mb-6">
              <SettingsIcon className="w-10 h-10 text-neon-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue/80 via-neon-purple/80 to-neon-pink/80 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-text-secondary/70 text-lg max-w-2xl mx-auto">
              Customize your experience and help us improve the game library
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* Tab Disguise Section */}
            <div className="glass glass-hover border border-white/10 rounded-2xl p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 text-neon-blue" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Tab Disguise</h2>
                </div>
                <p className="text-text-secondary/70 text-sm">
                  Choose how this tab appears in your browser. The title and icon will change to match your selection.
                </p>
              </div>

              {/* Tab Options */}
              <div className="space-y-3">
                {tabOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleTabSelection(option.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedTab === option.id
                        ? 'bg-neon-blue/10 border-neon-blue/50 shadow-neon'
                        : 'bg-surface/30 border-white/10 hover:border-white/20 hover:bg-surface/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isAnimating}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={option.faviconUrl} 
                          alt={`${option.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold ${
                          selectedTab === option.id ? 'text-neon-blue' : 'text-text-primary'
                        }`}>
                          {option.name}
                        </div>
                        <div className="text-text-secondary/60 text-xs">
                          FCS | {option.name}
                        </div>
                      </div>
                    </div>
                    {selectedTab === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-xl">
                <p className="text-text-secondary/70 text-sm leading-relaxed">
                  💡 <span className="font-semibold text-text-primary">Pro Tip:</span> Your preference is saved locally on this device and will persist across sessions.
                </p>
              </div>
            </div>

            {/* Game Suggestion Section */}
            <div className="glass glass-hover border border-white/10 rounded-2xl p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-neon-blue" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Suggest Games</h2>
                </div>
                <p className="text-text-secondary/70 text-sm">
                  Help us expand our library by suggesting new games you&apos;d like to see added.
                </p>
              </div>

              {status === 'success' ? (
                // Success Message
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Thanks!</h3>
                  <p className="text-text-secondary/70">
                    Your suggestion was sent successfully. We&apos;ll review it soon!
                  </p>
                </motion.div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text-primary mb-2">
                      What game(s) would you like us to add?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="List the game(s) you want added..."
                      required
                      rows={5}
                      disabled={status === 'sending'}
                      className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-500">
                        {errorMessage || 'Failed to submit. Please try again.'}
                      </p>
                    </motion.div>
                  )}

                  {/* Info Box */}
                  <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-xl">
                    <p className="text-text-secondary/70 text-sm leading-relaxed">
                      💡 <span className="font-semibold text-text-primary">Tip:</span> Be specific! Include game names, genres, or features you&apos;d like to see.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={status === 'sending' || !message.trim()}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      status === 'sending' || !message.trim()
                        ? 'bg-surface/50 text-text-secondary/50 cursor-not-allowed'
                        : 'premium-button text-text-primary hover:scale-[1.02]'
                    }`}
                    whileHover={status !== 'sending' && message.trim() ? { scale: 1.02 } : {}}
                    whileTap={status !== 'sending' && message.trim() ? { scale: 0.98 } : {}}
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-text-secondary/30 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending...
                      </span>
                    ) : (
                      <span className="relative z-10">Submit Suggestion</span>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
