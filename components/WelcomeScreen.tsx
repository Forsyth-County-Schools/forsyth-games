'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onComplete: () => void
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Cleanup function to prevent memory leaks
    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    onComplete()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center relative overflow-hidden">
      <div suppressHydrationWarning>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: i * 0.1,
                duration: 2 + Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          variants={containerVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
        >
          {/* Logo */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto shadow-neon">
              <span className="text-surface font-bold text-3xl">FG</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Forsyth Games
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-textSecondary mb-8"
            variants={itemVariants}
          >
            Educational Gaming Experience
          </motion.p>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">293+ Games</h3>
              <p className="text-textSecondary">Educational and brain-training games</p>
            </div>
            <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">Skill Building</h3>
              <p className="text-textSecondary">Enhance cognitive development</p>
            </div>
            <div className="bg-surface/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="text-3xl mb-3">🏫</div>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">School Safe</h3>
              <p className="text-textSecondary">Secure educational environment</p>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            onClick={handleContinue}
            className="bg-neon-blue text-surface px-8 py-4 rounded-full font-semibold text-lg shadow-neon hover:shadow-neon-lg transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Gaming Portal
          </motion.button>

          {/* Skip Link */}
          <motion.p
            className="mt-6 text-gray-400 text-sm"
            variants={itemVariants}
          >
            Press{' '}
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd>{' '}
            or{' '}
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>{' '}
            to continue
          </motion.p>

          {/* Keyboard Navigation */}
          {showContent && (
            <div className="absolute bottom-4 right-4">
              <motion.button
                onClick={handleContinue}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Skip →
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
