'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, TrendingUp, Users, Star } from 'lucide-react'

interface FeaturedGame {
  name: string
  image: string
  url: string
  players: string
  genre: string
  rating: number
}

export default function HeroSection() {
  const [featuredGame] = useState<FeaturedGame>({
    name: "1v1.LOL",
    image: "logo.png",
    url: "1v1lol",
    players: "2.3K Online",
    genre: "Battle Royale",
    rating: 4.8
  })

  const serverUrl = "https://gms.parcoil.com"

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TrendingUp className="w-4 h-4 text-neon-lime" />
              <span className="text-neon-lime text-sm font-semibold">Trending Now</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-textPrimary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Forsyth Games
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-textSecondary mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Ultimate Educational Gaming Portal with 293+ brain-training games designed for students.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => window.location.href = `/play?gameurl=${featuredGame.url}/`}
                className="group relative inline-flex items-center gap-3 bg-neon-blue text-surface px-8 py-4 rounded-full font-semibold text-lg shadow-neon transition-all duration-300 hover:shadow-neon-lg hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>Play Featured</span>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                onClick={() => window.location.href = "/#games"}
                className="inline-flex items-center gap-3 bg-surface/80 backdrop-blur-md border border-white/10 text-textPrimary px-8 py-4 rounded-full font-semibold text-lg hover:bg-surfaceHover transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Games
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-blue">293+</div>
                <div className="text-textSecondary text-sm">Educational Games</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-lime">{featuredGame.players}</div>
                <div className="text-textSecondary text-sm">Players Online</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-purple">4.8★</div>
                <div className="text-textSecondary text-sm">User Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Game Card */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative group">
              {/* Glass Card */}
              <motion.div 
                className="relative bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-500"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Game Image */}
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={`${serverUrl}/${featuredGame.url}/${featuredGame.image}`}
                    alt={featuredGame.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-family='Arial' font-size='24'%3E${featuredGame.name}%3C/text%3E%3C/svg%3E`
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <motion.button
                      onClick={() => window.location.href = `/play?gameurl=${featuredGame.url}/`}
                      className="bg-neon-blue text-surface px-8 py-4 rounded-full font-semibold flex items-center gap-3 shadow-neon hover:shadow-neon-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-6 h-6" />
                      <span>Play Now</span>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-textPrimary">{featuredGame.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-textSecondary">{featuredGame.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neon-lime" />
                      <span className="text-textSecondary">{featuredGame.players}</span>
                    </div>
                    <div className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded-full text-neon-purple text-xs font-semibold">
                      {featuredGame.genre}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-neon-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
