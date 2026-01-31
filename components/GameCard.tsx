'use client'

import { motion } from 'framer-motion'
import { Play, Star } from 'lucide-react'

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
    try {
      window.location.href = `/play?gameurl=${game.url}/`
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback: try opening in new tab
      window.open(`/play?gameurl=${game.url}/`, '_blank')
    }
  }

  const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
    hover: { 
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { 
      scale: 0.95 
    },
  }

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      className="group cursor-pointer"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={handleGameClick}
    >
      <motion.div 
        className="relative bg-surface rounded-xl overflow-hidden border border-surfaceHover shadow-card hover:shadow-card-hover"
        layout
      >
        {/* New Badge */}
        {game.new && (
          <motion.div
            className="absolute top-3 right-3 z-10 bg-gradient-to-r from-accent to-primary text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Star className="w-3 h-3" />
            NEW
          </motion.div>
        )}
        
        {/* Game Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={`${serverUrl}/${game.url}/${game.image}`}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1aa' font-family='Arial' font-size='14'%3E${game.name}%3C/text%3E%3C/svg%3E`
            }}
          />
          
          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center"
            variants={overlayVariants}
            initial="initial"
            whileHover="hover"
          >
            <motion.div 
              className="flex items-center gap-2 text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Play className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium">Play Now</span>
            </motion.div>
          </motion.div>

          {/* Gradient Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent via-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ zIndex: -1 }}
          />
        </div>
        
        {/* Game Name */}
        <motion.div 
          className="p-4 bg-gradient-to-b from-transparent to-surface/50"
          whileHover={{ y: -2 }}
        >
          <h3 className="text-white font-medium text-sm text-center truncate group-hover:text-accent transition-colors">
            {game.name}
          </h3>
        </motion.div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.1), transparent 50%)',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </motion.div>
    </motion.div>
  )
}
