'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, X, Check } from 'lucide-react'

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

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [selectedTab, setSelectedTab] = useState<string>('classlink')
  const [isAnimating, setIsAnimating] = useState(false)

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="glass-premium border border-white/20 rounded-3xl shadow-holographic overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10 border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
                      <p className="text-text-secondary/70 text-sm">Customize your experience</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-surfaceHover/50 border border-transparent hover:border-white/10 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Tab Disguise</h3>
                  <p className="text-text-secondary/70 text-sm mb-4">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
