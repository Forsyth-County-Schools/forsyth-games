'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Youtube, Play, X, Loader2, Sparkles, Zap, Volume2, Maximize2 } from 'lucide-react'
import FloatingNavigation from '@/components/FloatingNavigation'
import Footer from '@/components/Footer'

// Constants
const PARTICLE_COUNT = 15
const MOUSE_THROTTLE_MS = 16 // ~60fps

// Mouse movement throttling is now handled with useRef and setTimeout

// Utility: Validate YouTube URL
function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/
  ]
  return patterns.some(pattern => pattern.test(url))
}

export default function YouTubePage() {
  const [url, setUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [mounted, setMounted] = useState(false)
  const errorAnnouncerRef = useRef<HTMLDivElement>(null)
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle mounting to avoid SSR issues
  useEffect(() => {
    setMounted(true)
    setWindowSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    })

    const handleResize = () => {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

    // Throttled mouse tracking for performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Create a throttled version of the handler
  const throttledHandleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!throttleTimer.current) {
        throttleTimer.current = setTimeout(() => {
          handleMouseMove(e);
          throttleTimer.current = null;
        }, MOUSE_THROTTLE_MS);
      }
    },
    [handleMouseMove]
  );

  // Set up the event listener
  useEffect(() => {
    if (!mounted) return;
    
    const handler = (e: MouseEvent) => {
      throttledHandleMouseMove(e);
    };
    
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [mounted, throttledHandleMouseMove]);

  const handlePlay = async () => {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Please enter a YouTube URL')
      return
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      setError('Please enter a valid YouTube URL (youtube.com or youtu.be)')
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
        body: JSON.stringify({ url: trimmedUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load video')
      }

      if (data.success && data.embedUrl) {
        setEmbedUrl(data.embedUrl)
        setVideoTitle(data.title || 'YouTube Video')
        setError(null)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading the video'
      setError(errorMessage)
      setEmbedUrl(null)
      setVideoTitle('')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUrl('')
    setEmbedUrl(null)
    setVideoTitle('')
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handlePlay()
    }
  }

  // Generate particle initial positions only on client
  const particlePositions = mounted
    ? Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        scale: Math.random() * 2 + 0.5,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5
      }))
    : []

  const cursorGlowSize = 384 // 96 * 4 (w-96 = 384px)
  const cursorGlowOffset = cursorGlowSize / 2

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Screen reader announcements */}
      <div 
        ref={errorAnnouncerRef}
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {error && `Error: ${error}`}
        {loading && 'Loading video...'}
        {embedUrl && videoTitle && `Now playing: ${videoTitle}`}
      </div>

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial gradient following mouse */}
        {mounted && (
          <div 
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(255,0,255,0.2) 50%, transparent 100%)',
              left: mousePosition.x - cursorGlowOffset,
              top: mousePosition.y - cursorGlowOffset,
            }}
          />
        )}
        
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
        
        {/* Animated particles */}
        {mounted && (
          <div className="absolute inset-0">
            {particlePositions.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: particle.scale,
                }}
                animate={{
                  y: [null, -1000],
                  opacity: [0.6, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingNavigation 
        onSearchToggle={() => setIsSearchActive(!isSearchActive)}
        isSearchActive={isSearchActive}
      />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.header 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* YouTube Icon */}
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 relative overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              aria-hidden="true"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10" />
              
              {/* Static gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 opacity-80" />
              
              <Youtube className="w-12 h-12 text-white relative z-10" aria-hidden="true" />
            </motion.div>

            {/* Title with gradient text */}
            <motion.h1 
              className="text-6xl md:text-8xl font-black mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span 
                className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                YouTube Player
              </span>
            </motion.h1>

            <motion.p 
              className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience YouTube in stunning clarity. Paste any link and immerse yourself in premium playback.
            </motion.p>
          </motion.header>

          {/* Input Container */}
          <motion.div 
            className="relative mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Glass card */}
            <div className="relative backdrop-blur-2xl bg-gray-900/30 border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Glow border */}
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50" 
                aria-hidden="true"
              />
              
              <div className="relative z-10 space-y-6">
                {/* URL Input */}
                <div>
                  <motion.label 
                    htmlFor="youtube-url" 
                    className="block text-sm font-medium text-gray-200 mb-3 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    YouTube URL
                  </motion.label>
                  <div className="relative">
                    <input
                      id="youtube-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-6 py-4 bg-black/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 text-lg"
                      disabled={loading}
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? 'url-error' : 'url-help'}
                      autoComplete="url"
                    />
                  </div>
                  <p id="url-help" className="sr-only">
                    Enter a YouTube video URL. Supports youtube.com, youtu.be, and shorts links.
                  </p>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      id="url-error"
                      role="alert"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm backdrop-blur-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={handlePlay}
                    disabled={loading || !url.trim()}
                    className="flex-1 relative group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded-2xl"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    aria-label={loading ? 'Loading video' : 'Play video'}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    
                    <div className="relative px-8 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            aria-hidden="true"
                          >
                            <Loader2 className="w-6 h-6" />
                          </motion.div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6" aria-hidden="true" />
                          <span>Play</span>
                          <Zap className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={handleClear}
                    disabled={loading}
                    className="px-6 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    aria-label="Clear input and video"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video Player */}
          <AnimatePresence>
            {embedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 300 }}
                className="space-y-6"
              >
                {/* Video Title */}
                {videoTitle && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <h2 className="text-3xl font-bold text-white mb-2">{videoTitle}</h2>
                    <div className="flex items-center justify-center gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" aria-hidden="true" />
                        <span>High Quality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" aria-hidden="true" />
                        <span>Fullscreen Ready</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Video Container */}
                <div className="relative backdrop-blur-2xl bg-gray-900/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50" 
                    aria-hidden="true"
                  />
                  
                  <div className="relative z-10 aspect-video">
                    <iframe
                      src={embedUrl}
                      title={videoTitle || 'YouTube video player'}
                      className="w-full h-full rounded-3xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <AnimatePresence>
            {!embedUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12 text-center"
              >
                <motion.div 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <span className="text-gray-300 text-sm">
                    Supports: youtube.com/watch, youtu.be, youtube.com/shorts, and more
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}