'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  color: string
  bgColor: string
  borderColor: string
}

export default function CategoryPills({ onCategoryChange }: { onCategoryChange: (category: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories: Category[] = [
    { id: 'all', name: 'All Games', color: 'text-textPrimary', bgColor: 'bg-surface/60', borderColor: 'border-white/20' },
    { id: 'action', name: 'Action', color: 'text-neon-pink', bgColor: 'bg-neon-pink/20', borderColor: 'border-neon-pink/50' },
    { id: 'arcade', name: 'Arcade', color: 'text-neon-blue', bgColor: 'bg-neon-blue/20', borderColor: 'border-neon-blue/50' },
    { id: 'strategy', name: 'Strategy', color: 'text-neon-purple', bgColor: 'bg-neon-purple/20', borderColor: 'border-neon-purple/50' },
    { id: 'puzzle', name: 'Puzzle', color: 'text-neon-lime', bgColor: 'bg-neon-lime/20', borderColor: 'border-neon-lime/50' },
    { id: 'sports', name: 'Sports', color: 'text-orange-400', bgColor: 'bg-orange-400/20', borderColor: 'border-orange-400/50' },
    { id: 'racing', name: 'Racing', color: 'text-cyan-400', bgColor: 'bg-cyan-400/20', borderColor: 'border-cyan-400/50' },
  ]

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    onCategoryChange(categoryId)
  }

  return (
    <div className="relative z-20">
      {/* Floating Pills Container */}
      <div className="flex flex-wrap gap-3 justify-center p-6">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 backdrop-blur-md border ${category.borderColor} ${
              activeCategory === category.id
                ? `${category.bgColor} ${category.color} shadow-neon scale-110`
                : `${category.bgColor} text-textSecondary hover:scale-105 hover:shadow-card`
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">{category.name}</span>
            
            {/* Glow effect for active category */}
            {activeCategory === category.id && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-50 blur-md"
                style={{
                  background: category.id === 'all' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : category.id === 'action'
                    ? 'rgba(236, 72, 153, 0.5)'
                    : category.id === 'arcade'
                    ? 'rgba(34, 211, 238, 0.5)'
                    : category.id === 'strategy'
                    ? 'rgba(168, 85, 247, 0.5)'
                    : category.id === 'puzzle'
                    ? 'rgba(132, 204, 22, 0.5)'
                    : category.id === 'sports'
                    ? 'rgba(251, 146, 60, 0.5)'
                    : 'rgba(34, 211, 238, 0.5)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Floating Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-glow rounded-full blur-3xl opacity-30" />
      </div>
    </div>
  )
}
