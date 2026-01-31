'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp } from 'lucide-react'

interface SearchIslandProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchIsland({ onSearch, placeholder = "Search games..." }: SearchIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [gameNames, setGameNames] = useState<string[]>([])

  // Fetch actual games data on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/config/games.json')
        const data = await response.json()
        const names = data.map((game: { name: string }) => game.name)
        setGameNames(names)
      } catch (error) {
        console.error('Error fetching games:', error)
        // Fallback to empty array to prevent broken search functionality
        setGameNames([])
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0 && gameNames.length > 0) {
      const filtered = gameNames.filter(name =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [searchQuery, gameNames])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
    setIsExpanded(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearch(suggestion)
    setSuggestions([])
    setIsExpanded(false)
  }

  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      // Clear search when opening
      setSearchQuery('')
      setSuggestions([])
      onSearch('')
    }
  }

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Only show search button when not expanded */}
      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleSearch}
          className="bg-surface/60 backdrop-blur-xl border border-white/20 rounded-full shadow-glass px-6 py-4 flex items-center gap-3 hover:bg-surfaceHover/50 transition-all duration-300"
        >
          <Search className="w-5 h-5 text-textMuted" />
          <span className="text-textSecondary font-medium">
            Search games...
          </span>
        </motion.button>
      )}

      {/* Expanded Search Bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/20 rounded-full shadow-neon-lg p-2 min-w-[400px] max-w-[600px]">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textMuted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-textPrimary placeholder-textMuted pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
                    autoFocus
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-neon-blue text-surface px-4 py-2 rounded-full font-semibold hover:bg-neon-blue/80 transition-colors"
                >
                  Search
                </button>
                
                <button
                  onClick={() => {
                    setIsExpanded(false)
                    setSearchQuery('')
                    setSuggestions([])
                    onSearch('')
                  }}
                  className="text-textMuted hover:text-textPrimary p-2 rounded-full hover:bg-surfaceHover/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-neon-lg overflow-hidden z-10"
                >
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 text-textSecondary hover:bg-surfaceHover/50 hover:text-textPrimary rounded-lg transition-colors flex items-center gap-3"
                      >
                        <TrendingUp className="w-4 h-4 text-neon-lime" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
