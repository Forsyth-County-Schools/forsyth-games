'use client'

import { motion } from 'framer-motion'

interface GameSkeletonProps {
  size: 'small' | 'medium' | 'large' | 'wide'
}

export default function GameSkeleton({ size }: GameSkeletonProps) {
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

  return (
    <motion.div
      className={`${sizeClasses[size]} ${heightClasses[size]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-full bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {/* Image Skeleton */}
        <div className="relative h-3/5">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-surface/50 to-surface/30"
            animate={{
              background: [
                'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Info Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-sm">
          <div className="space-y-2">
            {/* Title Skeleton */}
            <div className="h-4 bg-surface/50 rounded w-3/4" />
            
            {/* Rating and Genre Skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-3 bg-surface/50 rounded w-1/4" />
              <div className="h-3 bg-surface/50 rounded w-1/3" />
            </div>
          </div>
        </div>

        {/* Gaming-inspired Loading Animation */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}
