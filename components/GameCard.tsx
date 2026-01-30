'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface Game {
  name: string
  image: string
  url: string
  new: boolean
}

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const serverUrl = "https://gms.parcoil.com"
  
  const handleGameClick = () => {
    window.location.href = `/play?gameurl=${game.url}/`
  }

  return (
    <div 
      className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
      onClick={handleGameClick}
    >
      <div className="relative bg-surface rounded-lg overflow-hidden border border-surface-hover hover:border-accent">
        {/* New Badge */}
        {game.new && (
          <div className="absolute top-2 right-2 z-10 bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold">
            NEW
          </div>
        )}
        
        {/* Game Image */}
        <div className="relative aspect-square">
          <img
            src={`${serverUrl}/${game.url}/${game.image}`}
            alt={game.name}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              // Fallback for broken images
              const target = e.target as HTMLImageElement
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b0b0b0' font-family='Arial' font-size='14'%3E${game.name}%3C/text%3E%3C/svg%3E`
            }}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center space-x-2 text-white">
              <ExternalLink size={20} />
              <span className="text-sm font-medium">Play Now</span>
            </div>
          </div>
        </div>
        
        {/* Game Name */}
        <div className="p-3">
          <h3 className="text-white font-medium text-sm text-center truncate">
            {game.name}
          </h3>
        </div>
      </div>
    </div>
  )
}
