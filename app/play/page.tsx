'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Maximize2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PlayPage() {
  const searchParams = useSearchParams()
  const gameUrl = searchParams.get('gameurl')
  const [gameName, setGameName] = useState('')
  const [error, setError] = useState('')

  const serverUrl = "https://gms.parcoil.com"

  useEffect(() => {
    if (!gameUrl) {
      setError('Game URL not provided!')
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
    } else if ((iframe as any).webkitRequestFullscreen) {
      (iframe as any).webkitRequestFullscreen()
    } else if ((iframe as any).msRequestFullscreen) {
      (iframe as any).msRequestFullscreen()
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
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
            <div className="h-6 w-px bg-surface-hover"></div>
            <h1 className="text-xl font-semibold text-white">
              {gameName || 'Loading Game...'}
            </h1>
          </div>
          
          <button
            onClick={handleFullscreen}
            className="inline-flex items-center space-x-2 bg-surface hover:bg-surface-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Maximize2 size={18} />
            <span>Fullscreen</span>
          </button>
        </div>

        {/* Game Frame Container */}
        <div className="bg-surface rounded-lg overflow-hidden border border-surface-hover">
          <iframe
            id="gameFrame"
            src={gameUrl ? `${serverUrl}/${gameUrl}` : ''}
            className="w-full h-[calc(100vh-200px)] min-h-[600px] border-0"
            title={gameName}
            allowFullScreen
          />
        </div>

        {/* Game Instructions */}
        <div className="mt-6 bg-surface rounded-lg p-6 border border-surface-hover">
          <h2 className="text-lg font-semibold text-white mb-3">How to Play</h2>
          <ul className="text-textSecondary space-y-2">
            <li>• Use your mouse and keyboard to play the game</li>
            <li>• Click the fullscreen button for a better experience</li>
            <li>• If the game doesn't load, try refreshing the page</li>
            <li>• Some games may take a moment to load</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
