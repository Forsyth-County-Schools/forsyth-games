'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Maximize2, RefreshCw, AlertTriangle, Gamepad2, Trophy, Star } from 'lucide-react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ErrorBoundary from '@/components/ErrorBoundary'
import gamesData from '@/config/games.json'

function PlayPageContent() {
  const searchParams = useSearchParams()
  const gameUrl = searchParams.get('gameurl')
  const [gameData, setGameData] = useState<{ name: string; image: string; url: string; new: boolean } | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const serverUrl = "https://forsyth-games.onrender.com/game"

  useEffect(() => {
    if (!gameUrl) {
      setError('Game URL not provided!')
      setIsLoading(false)
      return
    }

    // Find game data from games.json
    const cleanGameUrl = gameUrl.replace(/\/+$/, '')  // Remove all trailing slashes
    const game = gamesData.find(g => g.url === cleanGameUrl)
    
    if (game) {
      setGameData(game)
    } else {
      // Fallback to URL-based name if not found in games.json
      setGameData({
        name: gameUrl.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        image: 'logo.png',
        url: cleanGameUrl,
        new: false
      })
    }
  }, [gameUrl])

  const handleFullscreen = () => {
    if (!gameUrl) return
    
    // Create a new window with about:blank and write the game content
    const fullscreenWindow = window.open('', '_blank', 'fullscreen=yes,scrollbars=no, resizable=no')
    if (fullscreenWindow) {
      let gameSrc
      
      // Determine the correct game source
      if (gameUrl === 'madalin-stunt-cars-2') {
        gameSrc = "https://www.madalingames.com/madalingames/wp-content/uploads/games/webgl/M/MSC2-WEBGL/index.html"
      } else if (gameUrl.startsWith('games/')) {
        gameSrc = `/${gameUrl}/index.html`
      } else {
        gameSrc = `${serverUrl}/${gameUrl}`
      }
      
      fullscreenWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${gameData?.name || 'Game'} - Fullscreen</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #000;
                    overflow: hidden;
                    width: 100vw;
                    height: 100vh;
                }
                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .toolbar {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 9999;
                    display: flex;
                    gap: 8px;
                }
                .toolbar-btn {
                    background: rgba(255, 255, 255, 0.9);
                    color: #000;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                .toolbar-btn:hover {
                    background: rgba(255, 255, 255, 1);
                }
                .fullscreen-btn {
                    background: rgba(76, 175, 80, 0.9);
                    color: #fff;
                }
                .fullscreen-btn:hover {
                    background: rgba(76, 175, 80, 1);
                }
            </style>
        </head>
        <body>
            <div class="toolbar">
                <button class="toolbar-btn fullscreen-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
                <button class="toolbar-btn" onclick="window.close()">✕ Close</button>
            </div>
            <iframe src="${gameSrc}" allowfullscreen></iframe>
            <script>
                function toggleFullscreen() {
                    const docEl = document.documentElement;
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                        if (docEl.requestFullscreen) {
                            docEl.requestFullscreen();
                        } else if (docEl.webkitRequestFullscreen) {
                            docEl.webkitRequestFullscreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                }
            </script>
        </body>
        </html>
      `)
      fullscreenWindow.document.close()
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setError('')
    setIsLoading(true)
    setGameStarted(false)
    
    const iframe = document.getElementById('gameFrame') as HTMLIFrameElement
    if (iframe && gameUrl) {
      iframe.src = ''
      setTimeout(() => {
        // Check if this is Madalin Stunt Cars 2
        if (gameUrl === 'madalin-stunt-cars-2') {
          iframe.src = "https://www.madalingames.com/madalingames/wp-content/uploads/games/webgl/M/MSC2-WEBGL/index.html"
        } else {
          // Check if this is a local game (starts with 'games/')
          const isLocalGame = gameUrl.startsWith('games/')
          iframe.src = isLocalGame ? `/${gameUrl}/index.html` : `${serverUrl}/${gameUrl}`
        }
      }, 100)
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError('')
    setGameStarted(true)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setGameStarted(false)
    if (retryCount < 2) {
      setError('Game is loading slowly. Click retry to try again.')
    } else {
      setError('This game may be temporarily unavailable. Please try again later or choose a different game.')
    }
  }

  // Optimized game theme - simplified for performance
  const getGameTheme = (gameName: string) => {
    const name = gameName.toLowerCase()
    
    if (name.includes('2048') || name.includes('puzzle') || name.includes('sudoku')) {
      return {
        primary: 'from-purple-600 to-blue-600',
        secondary: 'bg-purple-500/20',
        accent: 'text-purple-400',
        category: 'Puzzle'
      }
    }
    if (name.includes('1v1') || name.includes('shooter') || name.includes('battle')) {
      return {
        primary: 'from-red-600 to-orange-600',
        secondary: 'bg-red-500/20',
        accent: 'text-red-400',
        category: 'Action'
      }
    }
    if (name.includes('racing') || name.includes('drive') || name.includes('car')) {
      return {
        primary: 'from-green-600 to-teal-600',
        secondary: 'bg-green-500/20',
        accent: 'text-green-400',
        category: 'Racing'
      }
    }
    if (name.includes('minecraft') || name.includes('craft') || name.includes('build')) {
      return {
        primary: 'from-emerald-600 to-green-600',
        secondary: 'bg-emerald-500/20',
        accent: 'text-emerald-400',
        category: 'Building'
      }
    }
    
    return {
      primary: 'from-blue-600 to-purple-600',
      secondary: 'bg-blue-500/20',
      accent: 'text-blue-400',
      category: 'Arcade'
    }
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-8 max-w-md mx-auto">
              <Gamepad2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-blue-400 text-2xl font-bold mb-4">Loading Game...</h2>
              <p className="text-white mb-6">Preparing your game experience</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const theme = getGameTheme(gameData.name)

  if (error && !gameUrl) {
    return (
      <div className="min-h-screen bg-deep-space text-text-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-red-400 text-2xl font-bold mb-4">Error</h2>
              <p className="text-white mb-6">{error}</p>
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Games</span>
              </Link>
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
        {/* Game Header with Theme */}
        <div className={`bg-gradient-to-r ${theme.primary} rounded-xl p-6 mb-6 shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Games</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {gameData.name}
                  </h1>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <span className={`px-2 py-1 rounded-full ${theme.secondary} ${theme.accent} text-xs font-medium`}>
                      {theme.category}
                    </span>
                    {gameData.new && (
                      <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                <RefreshCw size={18} className={retryCount > 0 ? 'animate-spin' : ''} />
                <span>Retry</span>
              </button>
              <button
                onClick={handleFullscreen}
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                <Maximize2 size={18} />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game Frame Container */}
        <div className={`${theme.secondary} rounded-xl overflow-hidden border border-white/10 shadow-2xl relative backdrop-blur-sm`}>
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${theme.accent.replace('text', 'border')} mb-4`}></div>
                <p className="text-white text-lg font-semibold">Loading {gameData.name}...</p>
                <p className="text-white/70 text-sm mt-2">
                  {retryCount > 0 ? `Attempt ${retryCount + 1} of 3` : 'Preparing your game experience'}
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <Gamepad2 className={`w-8 h-8 ${theme.accent} animate-pulse`} />
                </div>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && !isLoading && (
            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Game Loading Issue</h3>
                <p className="text-white/70 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className={`inline-flex items-center space-x-2 bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white px-6 py-3 rounded-lg transition-all`}
                  >
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center space-x-2 bg-surface hover:bg-surfaceHover text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Choose Different Game</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Game Iframe */}
          <iframe
            id="gameFrame"
            src={gameUrl ? (
              gameUrl === 'madalin-stunt-cars-2' 
                ? "https://www.madalingames.com/madalingames/wp-content/uploads/games/webgl/M/MSC2-WEBGL/index.html"
                : gameUrl.startsWith('games/') 
                  ? `/${gameUrl}/index.html` 
                  : `${serverUrl}/${gameUrl}`
            ) : ''}
            className="w-full h-[calc(100vh-200px)] min-h-[600px] border-0"
            title={gameData.name}
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Game Instructions with Theme */}
        <div className={`${theme.secondary} rounded-xl p-6 border border-white/10 backdrop-blur-sm`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary}`}>
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">How to Play {gameData.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className={`${theme.accent} font-medium mb-2 flex items-center space-x-2`}>
                <Gamepad2 size={16} />
                <span>Controls</span>
              </h3>
              <ul className="text-white/70 space-y-1 text-sm">
                <li>• Use mouse and keyboard</li>
                <li>• Click fullscreen for better view</li>
                <li>• Game-specific controls vary</li>
              </ul>
            </div>
            <div>
              <h3 className={`${theme.accent} font-medium mb-2 flex items-center space-x-2`}>
                <Trophy size={16} />
                <span>Tips</span>
              </h3>
              <ul className="text-white/70 space-y-1 text-sm">
                <li>• Games may need time to load</li>
                <li>• Try refresh if stuck</li>
                <li>• Check instructions in-game</li>
              </ul>
            </div>
            <div>
              <h3 className={`${theme.accent} font-medium mb-2 flex items-center space-x-2`}>
                <Star size={16} />
                <span>Category</span>
              </h3>
              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full ${theme.secondary} ${theme.accent} text-sm font-medium`}>
                  {theme.category}
                </span>
                {gameStarted && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Game Running</span>
                  </div>
                )}
              </div>
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
