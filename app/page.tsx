'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import CategoryPills from '@/components/CategoryPills'
import BentoGameCard from '@/components/BentoGameCard'
import SearchIsland from '@/components/SearchIsland'
import Footer from '@/components/Footer'

// Lazy load FloatingNavigation to improve initial load performance
const FloatingNavigation = lazy(() => import('@/components/FloatingNavigation'))

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
  const [displayLimit, setDisplayLimit] = useState(20)

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load and apply saved tab preferences
  useEffect(() => {
    const savedTab = localStorage.getItem('preferredTab')
    if (savedTab) {
      const tabOptions = [
        { id: 'classlink', name: 'ClassLink', faviconUrl: '/classlink-logo.png' },
        { id: 'infinite-campus', name: 'Infinite Campus', faviconUrl: '/infinite-campus-logo.png' },
        { id: 'google-drive', name: 'Google Drive', faviconUrl: '/google-drive-logo.png' }
      ]
      
      const option = tabOptions.find(opt => opt.id === savedTab)
      if (option) {
        document.title = `FCS | ${option.name}`
        
        const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement
        const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
        
        if (faviconLink) faviconLink.href = option.faviconUrl
        if (appleTouchIcon) appleTouchIcon.href = option.faviconUrl
      }
    }
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
        const response = await fetch('/api/games')
        const data = await response.json()
        
        // Transform and enhance games data - moved to useEffect to prevent hydration mismatch
        const enhancedGames = data.map((game: { name: string; image: string; url: string }) => ({
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

  const handleLoadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 20, filteredGames.length))
  }

  return (
    <div className="min-h-screen bg-deep-space text-text-primary relative overflow-hidden font-loading">
      {/* Fixed height containers to prevent CLS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="aurora-light aurora-1 hidden sm:block" />
        <div className="aurora-light aurora-2 hidden sm:block" />
        <div className="aurora-light aurora-3 hidden lg:block" />
        <div className="film-grain hidden xl:block" />
        <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none hidden 2xl:block" />
      </div>
      
      {/* Fixed navigation height */}
      <div className="nav-reserve">
        <Suspense fallback={<div className="h-20" />}>
          <FloatingNavigation 
            onSearchToggle={handleSearchToggle}
            isSearchActive={isSearchActive}
          />
        </Suspense>
      </div>
      
      {/* Search Island - Only show when search is active */}
      <AnimatePresence>
        {isSearchActive && (
          <SearchIsland 
            onSearch={handleSearch}
            placeholder="Search 204+ educational games..."
          />
        )}
      </AnimatePresence>
      
      {/* Main Content with stable layout */}
      <div className="relative">
        {/* Hero Section with fixed height */}
        <section id="home" className="hero-reserve">
          <HeroSection />
        </section>

        {/* Category Pills with stable container */}
        <section id="categories" className="relative min-h-[100px]">
          <CategoryPills onCategoryChange={handleCategoryChange} />
        </section>

        {/* Game Library with CLS prevention */}
        <section id="trending" className="relative py-20">
          <div className="container mx-auto px-6">
            {/* Search Results Header */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="text-center mb-12 min-h-[80px] stats-container">
                <h3 className="text-3xl font-bold text-text-primary mb-2 text-reserve">
                  {searchQuery && (
                    <span className="bg-gradient-to-r from-neon-blue/80 to-neon-purple/80 bg-clip-text text-transparent">
                      {filteredGames.length} Results for &quot;{searchQuery}&quot;
                    </span>
                  )}
                  {!searchQuery && selectedCategory !== 'all' && (
                    <span className="text-text-secondary/80">
                      {selectedCategory} Games
                    </span>
                  )}
                  {!searchQuery && selectedCategory === 'all' && (
                    <span className="text-text-secondary/80">
                      All Games
                    </span>
                  )}
                </h3>
                <p className="text-text-secondary/60 text-reserve">Discover amazing educational games</p>
              </div>
            )}

            <div className="text-center mb-16 min-h-[120px] stats-container">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-reserve">
                <span className="bg-gradient-to-r from-neon-blue/80 via-neon-purple/80 to-neon-pink/80 bg-clip-text text-transparent neon-text-glow">
                  Game Library
                </span>
              </h2>
              <p className="text-text-secondary/70 text-xl max-w-3xl mx-auto leading-relaxed text-reserve">
                Explore our curated collection of {filteredGames.length} educational games designed to enhance learning, critical thinking, and problem-solving skills
              </p>
            </div>

            {/* Optimized Grid Layout with CLS prevention */}
            <div className="game-grid lazy-load-container mb-12">
              {loading ? (
                // Show loading message instead of skeletons
                <div className="col-span-full text-center py-20">
                  <div className="text-2xl text-text-secondary mb-4">Loading Educational Games...</div>
                  <div className="w-16 h-16 mx-auto border-4 border-neon-blue/30 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                // Stable grid with fixed aspect ratios, prioritize first 6 games
                filteredGames.slice(0, displayLimit).map((game, index) => (
                  <div key={game.url} className="aspect-ratio-1-1">
                    <BentoGameCard
                      game={game}
                      size="medium"
                      priority={index < 6}
                    />
                  </div>
                ))
              )}
            </div>
            
            {/* Load more button with stable height */}
            {filteredGames.length > displayLimit && (
              <div className="text-center mt-8 min-h-[60px] stats-container">
                <button 
                  onClick={handleLoadMore}
                  className="glass-premium px-6 py-3 rounded-full text-text-primary border border-white/10 hover:border-neon-blue/50 transition-all duration-200 btn-stable hover:scale-105"
                >
                  Load More Games ({filteredGames.length - displayLimit} remaining)
                </button>
              </div>
            )}

            {/* Enhanced No Results with stable layout */}
            {!loading && filteredGames.length === 0 && (
              <div className="text-center py-24 min-h-[400px] stats-container">
                <div className="glass-premium border border-white/10 rounded-3xl p-16 max-w-lg mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
                    <span className="text-4xl">🎮</span>
                  </div>
                  <h3 className="text-3xl font-bold text-text-primary mb-4 text-reserve">No Games Found</h3>
                  <p className="text-text-secondary/70 mb-8 text-lg leading-relaxed text-reserve">
                    {searchQuery && (
                      <>No games found matching &quot;{searchQuery}&quot;. Try different keywords!</>
                    )}
                    {!searchQuery && selectedCategory !== 'all' && (
                      <>No games found in the &quot;{selectedCategory}&quot; category. Explore other categories!</>
                    )}
                    {!searchQuery && selectedCategory === 'all' && (
                      <>No games available at the moment. Check back soon!</>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center min-h-[60px] stats-container">
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          handleSearch('')
                        }}
                        className="conic-border px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 btn-stable"
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
                        className="premium-button px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 btn-stable"
                      >
                        <span className="relative z-10 text-text-primary">All Categories</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Simplified Stats Section with stable layout */}
            {!loading && filteredGames.length > 0 && (
              <div className="mt-12 text-center min-h-[80px] stats-container">
                <div className="inline-flex items-center gap-6 glass border border-white/10 rounded-full px-6 py-3">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-neon-blue text-reserve">{filteredGames.length}</div>
                    <div className="text-text-secondary/70 text-xs text-reserve">Games</div>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-neon-lime text-reserve">{games.filter(g => g.trending).length}</div>
                    <div className="text-text-secondary/70 text-xs text-reserve">Trending</div>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-neon-purple text-reserve">{games.filter(g => g.isNew).length}</div>
                    <div className="text-text-secondary/70 text-xs text-reserve">New</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
