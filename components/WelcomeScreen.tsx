'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Sparkles, Zap } from 'lucide-react'

interface WelcomeScreenProps {
  onComplete: () => void
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

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

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

  const glowVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 backdrop-blur-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={glowVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: i * 0.1,
                duration: 2 + Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Main Logo Animation */}
          <motion.div
            className="mb-8"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gamepad2 className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Title Animation */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Forsyth Games
          </motion.h1>

          {/* Subtitle Animation */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            <motion.span
              className="inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Ultimate Gaming Experience
              <Zap className="w-6 h-6 text-blue-400" />
            </motion.span>
          </motion.p>

          {/* Features Animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            {[
              { icon: Gamepad2, title: '293+ Games', desc: 'Huge collection' },
              { icon: Sparkles, title: 'Modern UI', desc: 'Beautiful design' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant play' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)' 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Continue Button */}
          <motion.button
            onClick={handleContinue}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Enter Gaming Portal</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <Gamepad2 className="w-5 h-5 relative z-10" />
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
        </div>

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
    </AnimatePresence>
  )
}
