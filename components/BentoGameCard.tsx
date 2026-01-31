'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Users, Star, TrendingUp } from 'lucide-react'

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
      className={`${sizeClasses[size]} ${heightClasses[size]} relative group cursor-pointer game-card opacity-0 transition-opacity duration-500`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      layout
    >
      {/* Glass Card with Floating Effect */}
      <motion.div 
        className="relative h-full floating-card glass glass-hover border border-white/10 rounded-2xl overflow-hidden neon-border-sweep"
        whileHover={{ 
          scale: 1.03,
          y: -12,
          rotateX: 3,
          rotateY: -3
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1500px'
        }}
      >
        {/* Game Image */}
        <div className="relative h-3/5 overflow-hidden">
          <Image
            src={`${serverUrl}/${game.url}/${game.image}`}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300F2FF;stop-opacity:0.1'/%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3C/svg%3E"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              // Prevent infinite error loops
              if (target.dataset.errorHandled === 'true') return
              target.dataset.errorHandled = 'true'
              
              // Try alternative image names
              const alternatives = ['logo.png', 'icon.png', 'thumbnail.png', 'default.png']
              let tried = 0
              
              const tryAlternative = () => {
                if (tried < alternatives.length) {
                  target.src = `${serverUrl}/${game.url}/${alternatives[tried]}`
                  tried++
                } else {
                  // Final fallback to SVG placeholder
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300F2FF;stop-opacity:0.2'/%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:0.2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Sora' font-size='24' font-weight='bold'%3E${game.name}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1aa' font-family='Sora' font-size='16'%3E${game.genre}%3C/text%3E%3C/svg%3E`
                }
              }
              
              tryAlternative()
            }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {game.trending && (
              <motion.div
                className="flex items-center gap-1 glass glass-hover rounded-full px-2 py-1 border border-white/10"
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
                className="glass glass-hover rounded-full px-2 py-1 border border-white/10"
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
              className="conic-border px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2 text-text-primary">
                <Play className="w-4 h-4" />
                <span>Play</span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 glass border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-text-primary truncate text-glow-subtle">{game.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-text-secondary text-sm">{game.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getGenreColor(game.genre)}`}>
              {game.genre}
            </div>
            <div className="flex items-center gap-1 text-text-secondary text-sm">
              <Users className="w-3 h-3" />
              <span>{game.players}</span>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 242, 255, 0.1), transparent 50%)',
          }}
        />
        
        {/* Floating Shadow */}
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-neon-blue/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            filter: 'blur(30px)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
