'use client'

import Image from 'next/image'
import { Play, Users, Star, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

interface Game {
  name: string
  image: string
  url: string
  genre: string
  players: string
  rating: number
  trending?: boolean
  isNew?: boolean
}

interface BentoGameCardProps {
  game: Game
  size: 'small' | 'medium' | 'large' | 'wide'
  priority?: boolean
}

export default function BentoGameCard({ game, size, priority = false }: BentoGameCardProps) {
  const router = useRouter()
  // All games now use GitHub URLs - no need for server constant
  
  // Check if game has local assets (only 5 games: ducklife4, ducklife5, geodash, geodesicalxx, polytrack)
  const localGames = ['games/ducklife4', 'games/ducklife5', 'games/geodash', 'geodesicalxx', 'polytrack', 'geodash']
  const hasLocalAssets = localGames.includes(game.url)
  
  // Use local path if assets exist locally, otherwise use the game's image path directly
  const imageUrl = hasLocalAssets 
    ? `/games/${game.url}/${game.image}`
    : game.image

  // Add validation for image URL
  const isValidImageUrl = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('undefined')

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1'
  }

  const heightClasses = {
    small: 'h-48',
    medium: 'h-96',
    large: 'h-96',
    wide: 'h-48'
  }

  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      'Action': 'border-neon-pink/50 bg-neon-pink/10',
      'Arcade': 'border-neon-blue/50 bg-neon-blue/10',
      'Strategy': 'border-neon-purple/50 bg-neon-purple/10',
      'Puzzle': 'border-neon-lime/50 bg-neon-lime/10',
      'Sports': 'border-orange-400/50 bg-orange-400/10',
      'Racing': 'border-cyan-400/50 bg-cyan-400/10',
    }
    return colors[genre] || 'border-white/20 bg-white/5'
  }

  return (
    <div
      className={`${sizeClasses[size]} ${heightClasses[size]} relative group cursor-pointer game-card`}
    >
      {/* Optimized Glass Card */}
      <div 
        className="relative h-full glass border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Optimized Game Image */}
        <div className="relative h-3/5 overflow-hidden">
          {isValidImageUrl ? (
            <Image
              src={imageUrl}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
              priority={priority ? true : false}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                if (target.dataset.errorHandled === 'true') return
                target.dataset.errorHandled = 'true'
                
                // Try fallbacks from game server
                const fallbacks = hasLocalAssets ? [
                  `/games/${game.url}/${game.image}`,
                  `/games/${game.url}/logo.png`,
                  `/games/${game.url}/icon.png`,
                  `/games/${game.url}/splash.png`,
                ] : [
                  game.image, // Use the direct image path from games.json (now points to placeholder)
                  '/games/placeholder.svg', // Fallback to placeholder
                ]
                
                let tried = 0
                
                const tryAlternative = () => {
                  if (tried < fallbacks.length) {
                    target.src = fallbacks[tried]
                    tried++
                  } else {
                    // Final fallback to SVG placeholder
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300F2FF;stop-opacity:0.2'/%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:0.2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Sora' font-size='24' font-weight='bold'%3E${game.name}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1aa' font-family='Sora' font-size='16'%3E${game.genre}%3C/text%3E%3C/svg%3E`
                  }
                }
                
                tryAlternative()
              }}
            />
          ) : (
            <div className="w-full h-full bg-surface/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-8 h-8 bg-neon-blue/40 rounded-full"></div>
                </div>
                <p className="text-text-secondary text-sm">{game.name}</p>
              </div>
            </div>
          )}
          
          {/* Simplified Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
          
          {/* Simplified Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {game.trending && (
              <div className="flex items-center gap-1 glass rounded-full px-2 py-1 border border-neon-lime/30">
                <TrendingUp className="w-3 h-3 text-neon-lime" />
                <span className="text-xs text-neon-lime font-semibold">TRENDING</span>
              </div>
            )}
            {game.isNew && (
              <div className="glass rounded-full px-2 py-1 border border-neon-blue/30">
                <span className="text-xs text-neon-blue font-semibold">NEW</span>
              </div>
            )}
          </div>

          {/* Simplified Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60">
            <button
              onClick={() => startTransition(() => router.push(`/play?gameurl=${game.url}/`))}
              className="premium-button px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-sm"
            >
              <span className="relative z-10 flex items-center gap-2 text-text-primary">
                <Play className="w-3 h-3" />
                <span>Play</span>
              </span>
            </button>
          </div>
        </div>

        {/* Simplified Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 glass border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-text-primary truncate text-sm">{game.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-text-secondary text-xs">{game.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getGenreColor(game.genre)}`}>
              {game.genre}
            </div>
            <div className="flex items-center gap-1 text-text-secondary text-xs">
              <Users className="w-3 h-3" />
              <span>{game.players}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
