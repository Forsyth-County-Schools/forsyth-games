'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, TrendingUp, Youtube, Search, X, Menu, Settings } from 'lucide-react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

interface NavigationItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface FloatingNavigationProps {
  onSearchToggle: () => void
  isSearchActive: boolean
}

export default function FloatingNavigation({ onSearchToggle, isSearchActive }: FloatingNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('home')
  const [isPlayingGame, setIsPlayingGame] = useState(false)

  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, href: '#trending' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, href: '/youtube' },
    { id: 'search', label: 'Search', icon: Search, href: '#search' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ]

  // Hide navigation on play page - using pathname from Next.js
  useEffect(() => {
    if (pathname === '/play') {
      setIsPlayingGame(true)
      setIsVisible(false)
    } else {
      setIsPlayingGame(false)
    }
  }, [pathname])

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrolledDown = currentScrollY > lastScrollY && currentScrollY > 100
      
      // Hide when scrolling down, show when scrolling up
      setIsVisible(!isScrolledDown)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const handleNavClick = (itemId: string, href: string) => {
    if (itemId === 'search') {
      onSearchToggle()
    } else if (itemId === 'settings' || itemId === 'youtube') {
      // Navigate to Settings or YouTube page using Next.js router
      router.push(href)
    } else {
      setActiveItem(itemId)
      setIsMobileMenuOpen(false)
      
      // Smooth scroll to section
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Desktop Floating Navigation */}
      <AnimatePresence>
        {isVisible && !isPlayingGame && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:block fixed top-2 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass-premium border border-white/10 rounded-full px-6 py-4 shadow-holographic">
              <div className="flex items-center justify-center gap-2">
                {/* Logo */}
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-yellow-500/50 glow-hover"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                  }}
                >
                  <Image 
                    src="https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png" 
                    alt="FCS Logo"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </motion.div>

                {/* Navigation Items */}
                <div className="flex items-center gap-1">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.id, item.href)}
                      className={`group relative p-2.5 rounded-xl transition-all duration-300 ${
                        item.id === 'search' && isSearchActive
                          ? 'bg-neon-blue/20 border border-neon-blue/50 shadow-neon'
                          : item.id === 'search' && !isSearchActive
                          ? 'hover:bg-surfaceHover/50 border border-transparent'
                          : activeItem === item.id
                          ? 'bg-neon-blue/20 border border-neon-blue/50 shadow-neon'
                          : 'hover:bg-surfaceHover/50 border border-transparent'
                      }`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          item.id === 'search' && isSearchActive
                          ? 'text-neon-blue'
                          : item.id === 'search' && !isSearchActive
                          ? 'text-text-secondary group-hover:text-text-primary'
                          : activeItem === item.id
                          ? 'text-neon-blue'
                          : 'text-text-secondary group-hover:text-text-primary'
                        }`} 
                      />
                      
                      {/* Tooltip */}
                      <motion.div
                        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-surface/90 backdrop-blur-md border border-white/10 rounded-lg text-text-primary text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                        initial={{ opacity: 0, y: -10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                      >
                        {item.label}
                      </motion.div>
                    </motion.button>
                  ))}

                  {/* Divider */}
                  <div className="w-px h-8 bg-white/20 mx-1" />

                  {/* Authentication Buttons */}
                  <SignedOut>
                    <SignInButton mode="modal">
                      <motion.button
                        className="px-3 py-2 rounded-xl glass-premium border border-white/10 text-text-primary text-sm font-semibold transition-all duration-300 hover:border-neon-blue/50 glow-hover"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign In
                      </motion.button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <motion.button
                        className="premium-button px-3 py-2 rounded-xl text-sm font-semibold"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 text-text-primary">Sign Up</span>
                      </motion.button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-xl border-2 border-neon-blue/50 shadow-neon-cyan hover:border-neon-purple/50 transition-all duration-300"
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <AnimatePresence>
          {isVisible && !isPlayingGame && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="glass glass-hover border-b border-white/10"
            >
              <div className="flex items-center justify-between p-4">
                {/* Logo */}
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-yellow-500/50"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                  }}
                >
                  <Image 
                    src="https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png" 
                    alt="FCS Logo"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg bg-surface/50 border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-text-primary" />
                  ) : (
                    <Menu className="w-6 h-6 text-text-primary" />
                  )}
                </motion.button>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    className="absolute top-full left-0 right-0 glass glass-hover border-b border-white/10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 space-y-2">
                      {navigationItems.map((item, index) => (
                        <motion.button
                          key={item.id}
                          onClick={() => handleNavClick(item.id, item.href)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                            item.id === 'search' && isSearchActive
                            ? 'bg-neon-blue/20 border border-neon-blue/50'
                            : item.id === 'search' && !isSearchActive
                            ? 'hover:bg-surfaceHover/50 border border-transparent'
                            : activeItem === item.id
                            ? 'bg-neon-blue/20 border border-neon-blue/50'
                            : 'hover:bg-surfaceHover/50 border border-transparent'
                            }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <item.icon 
                            className={`w-5 h-5 ${
                              item.id === 'search' && isSearchActive
                              ? 'text-neon-blue'
                              : item.id === 'search' && !isSearchActive
                              ? 'text-text-secondary'
                              : activeItem === item.id
                              ? 'text-neon-blue'
                              : 'text-text-secondary'
                              }`} 
                          />
                          <span className={`text-sm font-medium ${
                            item.id === 'search' && isSearchActive
                            ? 'text-neon-blue'
                            : item.id === 'search' && !isSearchActive
                            ? 'text-text-primary'
                            : activeItem === item.id
                            ? 'text-neon-blue'
                            : 'text-text-primary'
                            }`}>
                            {item.label}
                          </span>
                        </motion.button>
                      ))}
                      
                      {/* Mobile Authentication */}
                      <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                        <SignedOut>
                          <SignInButton mode="modal">
                            <motion.button
                              className="w-full p-3 rounded-lg glass glass-hover border border-white/10 text-text-primary text-sm font-semibold"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Sign In
                            </motion.button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <motion.button
                              className="w-full conic-border p-3 rounded-lg text-sm font-semibold"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="relative z-10 text-text-primary">Sign Up</span>
                            </motion.button>
                          </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                          <div className="flex items-center justify-center p-3">
                            <UserButton 
                              appearance={{
                                elements: {
                                  avatarBox: "w-12 h-12 rounded-xl border-2 border-neon-blue/50 shadow-neon-cyan"
                                }
                              }}
                            />
                          </div>
                        </SignedIn>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
