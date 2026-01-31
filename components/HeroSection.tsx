'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-space">
      {/* Aurora Light Leaks */}
      <div className="aurora-light aurora-1" />
      <div className="aurora-light aurora-2" />
      <div className="aurora-light aurora-3" />
      
      {/* Film Grain Overlay */}
      <div className="film-grain" />
      
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
              className="text-5xl md:text-7xl font-bold text-text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <Image 
                  src="https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png" 
                  alt="FCS Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <span className="bg-gradient-to-r from-neon-blue/90 via-neon-purple/90 to-neon-pink/90 bg-clip-text text-transparent">
                  Forsyth Games
                </span>
              </div>
            </motion.h1>

            <motion.p 
              className="text-xl text-text-secondary/80 mb-8 max-w-lg"
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
                onClick={() => window.location.href = "/#games"}
                className="inline-flex items-center gap-3 glass glass-hover text-text-primary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
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
              <div className="text-center glass glass-hover rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-neon-blue">293+</div>
                <div className="text-text-secondary/70 text-sm">Educational Games</div>
              </div>
              <div className="text-center glass glass-hover rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-neon-lime">{featuredGame.players}</div>
                <div className="text-text-secondary/70 text-sm">Players Online</div>
              </div>
              <div className="text-center glass glass-hover rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-neon-purple">4.8★</div>
                <div className="text-text-secondary/70 text-sm">User Rating</div>
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
              {/* 3D Bento Box */}
              <motion.div 
                className="relative floating-card glass glass-hover rounded-2xl overflow-hidden border border-white/10"
                whileHover={{ 
                  scale: 1.03, 
                  y: -15,
                  rotateX: 4,
                  rotateY: -4
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1500px'
                }}
              >
                {/* Game Image */}
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={`${serverUrl}/${featuredGame.url}/${featuredGame.image}`}
                    alt={featuredGame.name}
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
                          target.src = `${serverUrl}/${featuredGame.url}/${alternatives[tried]}`
                          tried++
                        } else {
                          // Final fallback to SVG placeholder
                          target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300F2FF;stop-opacity:0.3'/%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:0.3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Sora' font-size='32' font-weight='bold'%3E${featuredGame.name}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1aa' font-family='Sora' font-size='18'%3E${featuredGame.genre}%3C/text%3E%3C/svg%3E`
                        }
                      }
                      
                      tryAlternative()
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      className="conic-border px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-3 text-text-primary">
                        <Play className="w-6 h-6" />
                        <span>Play Now</span>
                      </span>
                    </motion.button>
                  </motion.div>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-text-primary">{featuredGame.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-text-secondary/80">{featuredGame.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neon-lime" />
                      <span className="text-text-secondary/80">{featuredGame.players}</span>
                    </div>
                    <div className="px-3 py-1 glass glass-hover rounded-full text-neon-purple/90 text-xs font-semibold border border-white/10">
                      {featuredGame.genre}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
