'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Maximize2, RefreshCw, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

function PlayPageContent() {
  const searchParams = useSearchParams()
  const gameUrl = searchParams.get('gameurl')
  const [gameName, setGameName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const serverUrl = "https://gms.parcoil.com"

  useEffect(() => {
    if (!gameUrl) {
      setError('Game URL not provided!')
      setIsLoading(false)
      return
    }

    // Extract game name from URL for display
    const nameFromUrl = gameUrl.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    setGameName(nameFromUrl)
  }, [gameUrl])

  const handleFullscreen = () => {
    const iframe = document.getElementById('gameFrame') as HTMLIFrameElement
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen()
    } else if ((iframe as HTMLIFrameElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
      (iframe as HTMLIFrameElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen()
    } else if ((iframe as HTMLIFrameElement & { msRequestFullscreen?: () => void }).msRequestFullscreen) {
      (iframe as HTMLIFrameElement & { msRequestFullscreen: () => void }).msRequestFullscreen()
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setError('')
    setIsLoading(true)
    
    const iframe = document.getElementById('gameFrame') as HTMLIFrameElement
    if (iframe) {
      iframe.src = ''
      setTimeout(() => {
        iframe.src = `${serverUrl}/${gameUrl}`
      }, 100)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError('')
  }

  const handleIframeError = () => {
    setIsLoading(false)
    if (retryCount < 2) {
      setError('Game is loading slowly. Click retry to try again.')
    } else {
      setError('This game may be temporarily unavailable. Please try again later or choose a different game.')
    }
  }

  if (error && !gameUrl) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-red-400 text-2xl font-bold mb-4">Error</h2>
              <p className="text-white mb-6">{error}</p>
              <a 
                href="/"
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Games</span>
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <a 
              href="/"
              className="inline-flex items-center space-x-2 text-textSecondary hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Games</span>
            </a>
            <div className="h-6 w-px bg-surfaceHover"></div>
            <h1 className="text-xl font-semibold text-white">
              {gameName || 'Loading Game...'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 bg-surface hover:bg-surfaceHover text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={18} className={retryCount > 0 ? 'animate-spin' : ''} />
              <span>Retry</span>
            </button>
            <button
              onClick={handleFullscreen}
              className="inline-flex items-center space-x-2 bg-surface hover:bg-surfaceHover text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Maximize2 size={18} />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Game Frame Container */}
        <div className="bg-surface rounded-xl overflow-hidden border border-surfaceHover shadow-card relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
                <p className="text-white text-lg">Loading Game...</p>
                <p className="text-textSecondary text-sm mt-2">
                  {retryCount > 0 ? `Attempt ${retryCount + 1} of 3` : 'This may take a few moments'}
                </p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && !isLoading && (
            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Game Loading Issue</h3>
                <p className="text-textSecondary mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center space-x-2 bg-surface hover:bg-surfaceHover text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Choose Different Game</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Game Iframe */}
          <iframe
            id="gameFrame"
            src={gameUrl ? `${serverUrl}/${gameUrl}` : ''}
            className="w-full h-[calc(100vh-200px)] min-h-[600px] border-0"
            title={gameName}
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Game Instructions */}
        <div className="mt-6 bg-surface/80 backdrop-blur-sm rounded-xl p-6 border border-surfaceHover">
          <h2 className="text-lg font-semibold text-white mb-3">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-accent font-medium mb-2">🎮 Controls</h3>
              <ul className="text-textSecondary space-y-1 text-sm">
                <li>• Use mouse and keyboard to play</li>
                <li>• Click fullscreen for better experience</li>
                <li>• Some games require specific controls</li>
              </ul>
            </div>
            <div>
              <h3 className="text-accent font-medium mb-2">💡 Tips</h3>
              <ul className="text-textSecondary space-y-1 text-sm">
                <li>• Games may take time to load</li>
                <li>• Try refresh if game doesn&apos;t start</li>
                <li>• Some games need internet connection</li>
              </ul>
            </div>
          </div>
          
          {retryCount >= 2 && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> If this game continues to have issues, it may be temporarily unavailable. 
                Please try again later or explore our other 292+ educational games!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PlayPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p className="text-white text-lg">Loading Game...</p>
          </div>
        </div>
      }>
        <PlayPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}
