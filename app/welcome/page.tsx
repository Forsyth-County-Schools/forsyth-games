'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Gamepad2, ChevronRight, Zap } from 'lucide-react'
import { startTransition } from 'react'

export default function WelcomePage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Increment progress bar
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1.5))
    }, 40)

    // Redirect after 3.2 seconds
    const timer = setTimeout(() => {
      startTransition(() => {
        router.push('/')
      })
    }, 3200)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  // Prevent hydration mismatch by not rendering numbers until mounted
  if (!mounted) return <div className="min-h-screen bg-[#050505]" />

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-12"
        >
          <div className="relative z-10 w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
            <Gamepad2 className="w-10 h-10 text-blue-400" />
          </div>
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 scale-150" />
        </motion.div>

        {/* Typography Section */}
        <div className="text-center space-y-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-sm font-black tracking-[0.3em] uppercase text-blue-400/80"
          >
            Initializing Experience
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Forsyth <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Games</span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl font-light tracking-wide max-w-md mx-auto"
          >
            Elevating education through 293+ interactive modules.
          </motion.p>
        </div>

        {/* Modern Progress Bar */}
        <div className="w-full max-w-sm space-y-4">
          <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>System Ready</span>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Footer / Skip Action */}
      <motion.button
        onClick={() => startTransition(() => router.push('/'))}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 group flex items-center gap-2 text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors"
      >
        Skip Intro <ChevronRight className="w-4 h-4" />
      </motion.button>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </div>
  )
}
