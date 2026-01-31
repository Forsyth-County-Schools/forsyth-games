'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, TrendingUp, Grid3x3, Search, X, Menu } from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface NavigationSidebarProps {
  onSearchToggle: () => void
  isSearchActive: boolean
}

export default function NavigationSidebar({ onSearchToggle, isSearchActive }: NavigationSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('home')

  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, href: '#trending' },
    { id: 'categories', label: 'Categories', icon: Grid3x3, href: '#categories' },
    { id: 'search', label: 'Search', icon: Search, href: '#search' },
  ]

  const handleNavClick = (itemId: string, href: string) => {
    if (itemId === 'search') {
      onSearchToggle()
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
      {/* Desktop Sidebar */}
      <nav className="hidden lg:block fixed left-0 top-0 h-full w-20 bg-surface/60 backdrop-blur-xl border-r border-white/10 z-40">
        <div className="flex flex-col items-center py-8 h-full">
          {/* Logo */}
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mb-12 shadow-neon"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-surface font-bold text-xl">FG</span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                className={`group relative p-3 rounded-xl transition-all duration-300 ${
                  item.id === 'search' && isSearchActive
                    ? 'bg-neon-blue/20 border border-neon-blue/50 shadow-neon'
                    : item.id === 'search' && !isSearchActive
                    ? 'hover:bg-surfaceHover/50 border border-transparent'
                    : activeItem === item.id
                    ? 'bg-neon-blue/20 border border-neon-blue/50 shadow-neon'
                    : 'hover:bg-surfaceHover/50 border border-transparent'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon 
                  className={`w-6 h-6 transition-colors duration-300 ${
                    item.id === 'search' && isSearchActive
                    ? 'text-neon-blue'
                    : item.id === 'search' && !isSearchActive
                    ? 'text-textSecondary group-hover:text-textPrimary'
                    : activeItem === item.id
                    ? 'text-neon-blue'
                    : 'text-textSecondary group-hover:text-textPrimary'
                  }`} 
                />
                
                {/* Tooltip */}
                <motion.div
                  className="absolute left-full ml-4 px-3 py-2 bg-surface/90 backdrop-blur-md border border-white/10 rounded-lg text-textPrimary text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                >
                  {item.label}
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center shadow-neon"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-surface font-bold text-lg">FG</span>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-surface/50 border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-textPrimary" />
            ) : (
              <Menu className="w-6 h-6 text-textPrimary" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/10"
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
                        ? 'text-textSecondary'
                        : activeItem === item.id
                        ? 'text-neon-blue'
                        : 'text-textSecondary'
                      }`} 
                    />
                    <span className={`text-sm font-medium ${
                      item.id === 'search' && isSearchActive
                    ? 'text-neon-blue'
                    : item.id === 'search' && !isSearchActive
                    ? 'text-textPrimary'
                    : activeItem === item.id
                    ? 'text-neon-blue'
                    : 'text-textPrimary'
                    }`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
