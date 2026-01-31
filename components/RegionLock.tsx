'use client'

import { motion } from 'framer-motion'
import { MapPin, ShieldAlert, Globe } from 'lucide-react'

interface RegionLockProps {
  region?: string
  country?: string
}

export default function RegionLock({ region, country }: RegionLockProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-glow">
              <ShieldAlert className="w-12 h-12 text-neon-blue" />
            </div>
            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-neon-blue/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Access Restricted
          </span>
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-xl text-textSecondary mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Forsyth Games is exclusively available to users located in Georgia, United States.
        </motion.p>

        {/* Location Info */}
        <motion.div
          className="glass glass-hover border border-white/10 rounded-xl p-6 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-textPrimary">Your Location</h3>
          </div>
          <div className="space-y-2 text-textSecondary">
            {region && country && (
              <p className="text-base">
                Detected: <span className="text-textPrimary font-medium">{region}, {country}</span>
              </p>
            )}
            {!region && !country && (
              <p className="text-base">
                Unable to verify your location
              </p>
            )}
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="glass border border-white/10 rounded-xl p-6 text-left">
            <Globe className="w-8 h-8 text-neon-purple mb-3" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Regional Access</h3>
            <p className="text-sm text-textSecondary">
              This platform is designed specifically for students and educators in Georgia, US.
            </p>
          </div>
          <div className="glass border border-white/10 rounded-xl p-6 text-left">
            <ShieldAlert className="w-8 h-8 text-neon-pink mb-3" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Security Measure</h3>
            <p className="text-sm text-textSecondary">
              Location verification ensures compliance with educational access policies.
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="border-t border-white/10 pt-6"
          variants={itemVariants}
        >
          <p className="text-sm text-textMuted">
            If you believe this is an error and you are located in Georgia, US, please contact your system administrator.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
