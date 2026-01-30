'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import GameCard from '@/components/GameCard'
import Footer from '@/components/Footer'

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Forsyth Games
          </h1>
          <p className="text-textSecondary text-lg">
            v2.0 - Modern Gaming Experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-surface-hover rounded-lg text-white placeholder-textSecondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="mt-4 text-textSecondary">Loading games...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGames.map((game, index) => (
              <GameCard key={index} game={game} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-textSecondary text-lg">
              No games found matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-8 text-center text-textSecondary">
            <p>
              Showing {filteredGames.length} of {games.length} games
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
