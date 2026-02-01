'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Loader2, Youtube } from 'lucide-react'
import FloatingNavigation from '@/components/FloatingNavigation'
import Footer from '@/components/Footer'

export default function YouTubePage() {
  const [url, setUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handlePlay = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/youtube/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load video')
      }

      if (data.success && data.embedUrl) {
        setEmbedUrl(data.embedUrl)
        setError(null)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setEmbedUrl(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUrl('')
    setEmbedUrl(null)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handlePlay()
    }
  }

  return (
    <div className="min-h-screen bg-deep-space text-text-primary relative overflow-hidden">
      {/* Aurora Light Leaks */}
      <div className="aurora-light aurora-1" />
      <div className="aurora-light aurora-2" />
      <div className="aurora-light aurora-3" />
      
      {/* Film Grain Overlay */}
      <div className="film-grain" />
      
      <FloatingNavigation 
        onSearchToggle={() => setIsSearchActive(!isSearchActive)}
        isSearchActive={isSearchActive}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass glass-hover border border-white/10 mb-6">
              <Youtube className="w-10 h-10 text-neon-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-neon-blue/80 via-neon-purple/80 to-neon-pink/80 bg-clip-text text-transparent">
                YouTube Player
              </span>
            </h1>
            <p className="text-text-secondary/70 text-lg max-w-2xl mx-auto">
              Watch YouTube videos directly on our site. Paste any YouTube link and click Play.
            </p>
          </div>

          {/* Input Container */}
          <div className="glass glass-hover border border-white/10 rounded-2xl p-8 mb-8">
            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label htmlFor="youtube-url" className="block text-sm font-medium text-text-secondary/80 mb-2">
                  YouTube URL
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-surface/80 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 transition-all"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePlay}
                  disabled={loading || !url.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue/80 to-neon-purple/80 hover:from-neon-blue hover:to-neon-purple text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-6 py-3 bg-surface/80 hover:bg-surface border border-white/10 hover:border-white/20 text-text-secondary hover:text-text-primary font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <AnimatePresence>
            {embedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass glass-hover border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="YouTube video player"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!embedUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-text-secondary/60 text-sm">
                Supported formats: youtube.com/watch, youtu.be, youtube.com/shorts, and more
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
