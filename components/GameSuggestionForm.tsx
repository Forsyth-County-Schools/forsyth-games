'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface GameSuggestionFormProps {
  isOpen: boolean
  onClose: () => void
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function GameSuggestionForm({ isOpen, onClose }: GameSuggestionFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    // Use environment variable if available
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    
    if (!accessKey) {
      setStatus('error')
      setErrorMessage('Form submission service is not available. Please contact support.')
      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 3000)
      return
    }
    
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
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setStatus('idle')
          onClose()
        }, 2000)
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

  const handleClose = () => {
    if (status !== 'sending') {
      setStatus('idle')
      setMessage('')
      onClose()
    }
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
            onClick={handleClose}
          />

          {/* Form Modal */}
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
                      <Send className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">Suggest Games</h2>
                      <p className="text-text-secondary/70 text-sm">Help us expand our library</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-surfaceHover/50 border border-transparent hover:border-white/10 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={status === 'sending'}
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
