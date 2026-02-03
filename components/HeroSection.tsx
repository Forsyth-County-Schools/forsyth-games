'use client'

import Image from 'next/image'
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
  const featuredGame: FeaturedGame = {
    name: "1v1.LOL",
    image: "logo.png",
    url: "1v1lol",
    players: "2.3K Online",
    genre: "Battle Royale",
    rating: 4.8
  }

  const serverUrl = "https://gms.parcoil.com"

  const handlePlayGame = () => {
    // Open about:blank in fullscreen with game content
    const fullscreenWindow = window.open('about:blank', '_blank')
    if (fullscreenWindow) {
      const gameSrc = `${serverUrl}/${featuredGame.url}`
      
      fullscreenWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${featuredGame.name} - Fullscreen</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #000;
                    overflow: hidden;
                    width: 100vw;
                    height: 100vh;
                }
                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                .close-btn {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 9999;
                    background: rgba(255, 255, 255, 0.9);
                    color: #000;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: background 0.3s;
                }
                .close-btn:hover {
                    background: rgba(255, 255, 255, 1);
                }
            </style>
        </head>
        <body>
            <button class="close-btn" onclick="window.close()">✕ Close</button>
            <iframe src="${gameSrc}" frameborder="0" scrolling="no" allowfullscreen></iframe>
            <script>
                // Request fullscreen on load
                document.addEventListener('DOMContentLoaded', function() {
                    var docEl = document.documentElement;
                    if (docEl.requestFullscreen) {
                        docEl.requestFullscreen();
                    } else if (docEl.webkitRequestFullscreen) {
                        docEl.webkitRequestFullscreen();
                    } else if (docEl.msRequestFullscreen) {
                        docEl.msRequestFullscreen();
                    }
                });
            </script>
        </body>
        </html>
      `)
      fullscreenWindow.document.close()
    }
  }

  return (
    <section className="hero-reserve overflow-hidden bg-deep-space">
      {/* Fixed background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="aurora-light aurora-1 hidden lg:block" />
        <div className="aurora-light aurora-2 hidden lg:block" />
        <div className="aurora-light aurora-3 hidden xl:block" />
        <div className="absolute inset-0 hidden 2xl:block">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Optimized Left Content with stable layout */}
          <div className="text-center lg:text-left space-y-6">
            {/* Fixed height for trending badge */}
            <div className="h-10 flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10">
                <TrendingUp className="w-4 h-4 text-neon-lime" />
                <span className="text-neon-lime text-sm font-semibold text-reserve">TRENDING NOW</span>
              </div>
            </div>

            {/* Fixed height for title */}
            <div className="min-h-[120px]">
              <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight text-reserve">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="flex-shrink-0 w-16 h-16">
                    <Image 
                      src="https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png" 
                      alt="FCS Logo"
                      width={64}
                      height={64}
                      className="object-contain"
                      style={{ width: 'auto', height: '64px' }}
                    />
                  </div>
                  <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                    Forsyth Games
                  </span>
                </div>
              </h1>
            </div>

            {/* Fixed height for description */}
            <div className="min-h-[80px]">
              <p className="text-xl text-text-secondary/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-reserve">
                <span className="block mb-1">🎮 Ultimate Educational Gaming Portal</span>
                <span className="text-lg text-text-secondary/60">293+ Educational Games • Brain-Training Arena</span>
              </p>
            </div>

            {/* Fixed height for buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start min-h-[60px]">
              <button className="inline-flex items-center gap-3 premium-button text-text-primary px-8 py-4 rounded-full font-semibold text-lg relative z-10 btn-stable">
                <span className="relative z-10">Browse Games</span>
                <span className="relative z-10">→</span>
              </button>
              
              <button className="inline-flex items-center gap-2 glass border border-white/20 text-text-primary px-8 py-4 rounded-full font-semibold text-lg hover:border-neon-blue/50 transition-all duration-200 btn-stable">
                <Play className="w-4 h-4" />
                <span>Quick Play</span>
              </button>
            </div>

            {/* Fixed height for stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 min-h-[100px]">
              <div className="text-center lg:text-left glass rounded-2xl p-4 border border-white/10 min-h-[80px] stats-container">
                <div className="text-3xl font-bold text-neon-blue mb-1 text-reserve">293+</div>
                <div className="text-text-secondary/70 text-xs uppercase tracking-wide text-reserve">Educational Games</div>
              </div>
              <div className="text-center lg:text-left glass rounded-2xl p-4 border border-white/10 min-h-[80px] stats-container">
                <div className="text-3xl font-bold text-neon-lime mb-1 text-reserve">{featuredGame.players}</div>
                <div className="text-text-secondary/70 text-xs uppercase tracking-wide text-reserve">Players Online</div>
              </div>
              <div className="text-center lg:text-left glass rounded-2xl p-4 border border-white/10 min-h-[80px] stats-container">
                <div className="text-3xl font-bold text-neon-purple mb-1 text-reserve">4.8★</div>
                <div className="text-text-secondary/70 text-xs uppercase tracking-wide text-reserve">User Rating</div>
              </div>
            </div>
          </div>

          {/* Optimized Right Content with stable dimensions */}
          <div className="relative hidden lg:block min-h-[500px]">
            <div className="relative group">
              {/* Fixed aspect ratio card */}
              <div className="glass rounded-2xl overflow-hidden border border-white/10 aspect-ratio-16-9">
                {/* Fixed height image container */}
                <div className="relative h-80 overflow-hidden image-placeholder">
                  <Image
                    src={`${serverUrl}/${featuredGame.url}/${featuredGame.image}`}
                    alt={featuredGame.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      // Fallback to placeholder if image fails
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300F2FF;stop-opacity:0.2'/%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6;stop-opacity:0.2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='40%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Sora' font-size='24' font-weight='bold'%3E${featuredGame.name}%3C/text%3E%3Ctext x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' fill='%23a1a1aa' font-family='Sora' font-size='16'%3E${featuredGame.genre}%3C/text%3E%3C/svg%3E`
                    }}
                  />
                  
                  {/* Fixed overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                  
                  {/* Fixed play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                    <button
                      onClick={handlePlayGame}
                      className="premium-button px-6 py-3 rounded-full font-semibold flex items-center gap-2 btn-stable"
                    >
                      <span className="relative z-10 flex items-center gap-2 text-text-primary">
                        <Play className="w-4 h-4" />
                        <span>Play Now</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Fixed game info height */}
                <div className="p-6 glass border-t border-white/10 min-h-[100px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-text-primary truncate text-reserve">{featuredGame.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-text-secondary/80 text-sm text-reserve">{featuredGame.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neon-lime" />
                      <span className="text-text-secondary/80 text-sm text-reserve">{featuredGame.players}</span>
                    </div>
                    <div className="px-3 py-1 glass rounded-full text-neon-purple/90 text-xs font-semibold border border-white/10">
                      {featuredGame.genre}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
