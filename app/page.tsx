'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import FloatingNavigation from '@/components/FloatingNavigation'
import CategoryPills from '@/components/CategoryPills'
import BentoGameCard from '@/components/BentoGameCard'
import GameSkeleton from '@/components/GameSkeleton'
import SearchIsland from '@/components/SearchIsland'
import Footer from '@/components/Footer'

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

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport')
          }
        })
      },
      { threshold: 0.1 }
    )

    const gameCards = document.querySelectorAll('.game-card')
    gameCards.forEach((card) => observer.observe(card))

    return () => {
      gameCards.forEach((card) => observer.unobserve(card))
    }
  }, [filteredGames])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/config/games.json')
        const data = await response.json()
        
        // Transform and enhance games data - moved to useEffect to prevent hydration mismatch
        const enhancedGames = data.map((game: any, index: number) => ({
          ...game,
          genre: ['Action', 'Arcade', 'Strategy', 'Puzzle', 'Sports', 'Racing'][Math.floor(Math.random() * 6)],
          players: `${Math.floor(Math.random() * 5000) + 100}`,
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          trending: Math.random() > 0.8,
          isNew: Math.random() > 0.9
        }))
        
        setGames(enhancedGames)
        setFilteredGames(enhancedGames)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    let filtered = games
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = games.filter(game => game.genre === selectedCategory)
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredGames(filtered)
  }, [selectedCategory, searchQuery, games])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive)
  }

  return (
    <div className="min-h-screen bg-deep-space text-text-primary relative overflow-hidden">
      {/* Aurora Light Leaks */}
      <div className="aurora-light aurora-1" />
      <div className="aurora-light aurora-2" />
      <div className="aurora-light aurora-3" />
      
      {/* Film Grain Overlay */}
      <div className="film-grain" />
      
      <FloatingNavigation 
        onSearchToggle={handleSearchToggle}
        isSearchActive={isSearchActive}
      />
      
      {/* Search Island - Only show when search is active */}
      <AnimatePresence>
        {isSearchActive && (
          <SearchIsland 
            onSearch={handleSearch}
            placeholder="Search 293+ educational games..."
          />
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div>
        {/* Hero Section */}
        <section id="home">
          <HeroSection />
        </section>

        {/* Category Pills */}
        <section id="categories" className="relative">
          <CategoryPills onCategoryChange={handleCategoryChange} />
        </section>

        {/* Bento Grid Game Library */}
        <section id="trending" className="relative">
          <div className="container mx-auto px-6 py-12">
            {/* Search Results Header */}
            {(searchQuery || selectedCategory !== 'all') && (
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-text-primary">
                  {searchQuery && (
                    <span className="bg-gradient-to-r from-neon-blue/80 to-neon-purple/80 bg-clip-text text-transparent">
                      {filteredGames.length} Results for "{searchQuery}"
                    </span>
                  )}
                  {!searchQuery && selectedCategory !== 'all' && (
                    <span className="text-text-secondary/80">
                      {' '} in {selectedCategory}
                    </span>
                  )}
                  {!searchQuery && selectedCategory === 'all' && (
                    <span className="text-text-secondary/80">
                      {' '} in All Games
                    </span>
                  )}
                </h3>
              </motion.div>
            )}

            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-neon-blue/80 via-neon-purple/80 to-neon-pink/80 bg-clip-text text-transparent">
                  Game Library
                </span>
              </h2>
              <p className="text-text-secondary/70 text-lg max-w-2xl mx-auto">
                Explore our collection of {filteredGames.length} educational games designed to enhance your learning experience
              </p>
            </motion.div>

            {/* Uniform Grid - All cards same size */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {loading ? (
                // Show skeleton loaders
                Array.from({ length: 20 }).map((_, index) => (
                  <GameSkeleton
                    key={`skeleton-${index}`}
                    size="medium"
                  />
                ))
              ) : (
                // Show actual games - all same size
                filteredGames.map((game, index) => (
                  <BentoGameCard
                    key={game.url}
                    game={game}
                    size="medium"
                    index={index}
                  />
                ))
              )}
            </div>

            {/* No Results */}
            {!loading && filteredGames.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-surface/40 backdrop-blur-xl glass border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">No Games Found</h3>
                  <p className="text-textSecondary/70 mb-6">
                    {searchQuery && (
                      <>No games found matching "{searchQuery}"</>
                    )}
                    {!searchQuery && selectedCategory !== 'all' && (
                      <>No games found in the "{selectedCategory}" category.</>
                    )}
                    {!searchQuery && selectedCategory === 'all' && (
                      <>No games available.</>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          handleSearch('')
                        }}
                        className="conic-border px-6 py-3 rounded-full font-semibold transition-all duration-300"
                      >
                        <span className="relative z-10 text-text-primary">Clear Search</span>
                      </button>
                    )}
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all')
                          handleCategoryChange('all')
                        }}
                        className="conic-border px-6 py-3 rounded-full font-semibold transition-all duration-300"
                      >
                        <span className="relative z-10 text-text-primary">All Categories</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            {!loading && filteredGames.length > 0 && (
              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-8 glass glass-hover border border-white/10 rounded-full px-8 py-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-blue">{filteredGames.length}</div>
                    <div className="text-text-secondary/70 text-sm">Games Available</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-lime">{games.filter(g => g.trending).length}</div>
                    <div className="text-text-secondary/70 text-sm">Trending Now</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-purple">{games.filter(g => g.isNew).length}</div>
                    <div className="text-text-secondary/70 text-sm">New Games</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
