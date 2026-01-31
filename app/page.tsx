'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import GameCard from '@/components/GameCard'
import Footer from '@/components/Footer'
import WelcomeScreen from '@/components/WelcomeScreen'
import ParticleBackground from '@/components/ParticleBackground'

interface Game {
  name: string
  image: string
  url: string
  new: boolean
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/config/games.json')
        const data = await response.json()
        setGames(data)
        setFilteredGames(data)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    const filtered = games.filter(game =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredGames(filtered)
  }, [searchTerm, games])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-dark-gradient relative"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ParticleBackground />
        
        <div className="relative z-10">
          <Navbar />
          
          <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Forsyth Games
              </motion.h1>
              <motion.p 
                className="text-textSecondary text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                v2.0 - Modern Gaming Experience
              </motion.p>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="max-w-md mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-surface/80 backdrop-blur-sm border border-surfaceHover rounded-lg text-white placeholder-textMuted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-card"
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
              />
            </motion.div>

            {/* Games Grid */}
            {loading ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="mt-4 text-textSecondary">Loading games...</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                variants={containerVariants}
                initial="initial"
                animate="animate"
              >
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.9 },
                    }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    layout
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No Results */}
            {!loading && filteredGames.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-surface/80 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto border border-surfaceHover">
                  <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
                  <p className="text-textSecondary">
                    No games matching "{searchTerm}" found. Try a different search term.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            {!loading && (
              <motion.div 
                className="mt-8 text-center text-textSecondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm">
                  Showing <span className="text-accent font-semibold">{filteredGames.length}</span> of{' '}
                  <span className="text-accent font-semibold">{games.length}</span> games
                </p>
              </motion.div>
            )}
          </main>

          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
