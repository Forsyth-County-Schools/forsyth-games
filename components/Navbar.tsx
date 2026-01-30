'use client'

import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-surface border-b border-surface-hover sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              Forsyth Games
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-textSecondary hover:text-white transition-colors"
            >
              Home
            </a>
            <a 
              href="#games" 
              className="text-textSecondary hover:text-white transition-colors"
            >
              Games
            </a>
            <a 
              href="#" 
              className="text-textSecondary hover:text-white transition-colors"
            >
              Categories
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-textSecondary hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-hover">
            <div className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="text-textSecondary hover:text-white transition-colors px-2 py-1"
              >
                Home
              </a>
              <a 
                href="#games" 
                className="text-textSecondary hover:text-white transition-colors px-2 py-1"
              >
                Games
              </a>
              <a 
                href="#" 
                className="text-textSecondary hover:text-white transition-colors px-2 py-1"
              >
                Categories
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
