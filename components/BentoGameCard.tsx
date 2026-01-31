'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Star, TrendingUp, Clock } from 'lucide-react'

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
  index: number
}

export default function BentoGameCard({ game, size, index }: BentoGameCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const serverUrl = "https://gms.parcoil.com"

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

  const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      y: 30 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        delay: index * 0.1,
      },
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
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
    <motion.div
      className={`${sizeClasses[size]} ${heightClasses[size]} relative group cursor-pointer`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      layout
    >
      {/* Glass Card */}
      <motion.div 
        className="relative h-full bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-500"
        whileHover={{ y: -5 }}
      >
        {/* Game Image */}
        <div className="relative h-3/5 overflow-hidden">
          <img
            src={`${serverUrl}/${game.url}/${game.image}`}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-family='Arial' font-size='24'%3E${game.name}%3C/text%3E%3C/svg%3E`
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {game.trending && (
              <motion.div
                className="flex items-center gap-1 px-2 py-1 bg-neon-lime/20 border border-neon-lime/50 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp className="w-3 h-3 text-neon-lime" />
                <span className="text-xs text-neon-lime font-semibold">Trending</span>
              </motion.div>
            )}
            {game.isNew && (
              <motion.div
                className="px-2 py-1 bg-neon-blue/20 border border-neon-blue/50 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs text-neon-blue font-semibold">NEW</span>
              </motion.div>
            )}
          </div>

          {/* Play Button Overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <motion.button
              onClick={() => window.location.href = `/play?gameurl=${game.url}/`}
              className="bg-neon-blue text-surface px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-neon hover:shadow-neon-lg transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4" />
              <span>Play</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-textPrimary truncate">{game.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-textSecondary text-sm">{game.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getGenreColor(game.genre)}`}>
              {game.genre}
            </div>
            <div className="flex items-center gap-1 text-textSecondary text-sm">
              <Users className="w-3 h-3" />
              <span>{game.players}</span>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 211, 238, 0.1), transparent 50%)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
