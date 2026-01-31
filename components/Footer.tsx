'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Heart, Shield, Zap, Users, TrendingUp } from 'lucide-react';

export default function Footer() {
  const EXTERNAL_URL = "https://weather.com/";

  const handleWeatherLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const confirmLeave = window.confirm(
      "You are leaving this website. Do you want to continue?"
    );
    
    if (!confirmLeave) {
      e.preventDefault();
    }
  };

  const stats = [
    { icon: Gamepad2, value: '293+', label: 'Games' },
    { icon: Users, value: '2.3K', label: 'Active Players' },
    { icon: TrendingUp, value: '63', label: 'Trending' },
    { icon: Heart, value: '4.8★', label: 'Rating' }
  ];

  const features = [
    { icon: Shield, text: 'Safe & Secure' },
    { icon: Zap, text: 'No Downloads' },
    { icon: Heart, text: 'Always Free' }
  ];

  return (
    <footer className="relative mt-auto overflow-hidden" role="contentinfo">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-surface" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(79, 209, 197, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 209, 197, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-neon-blue/50 transition-all duration-300 hover:shadow-neon-lg">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-neon-blue group-hover:text-neon-lime transition-colors" />
                <div className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-textSecondary/70 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 hover:border-neon-lime/50 transition-all duration-300"
            >
              <feature.icon className="w-5 h-5 text-neon-lime" />
              <span className="text-textPrimary font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          {/* Creator Credit */}
          <div className="flex items-center justify-center gap-2 text-textSecondary">
            <span className="text-sm">Crafted with</span>
            <Heart className="w-4 h-4 text-neon-pink animate-pulse" />
            <span className="text-sm">by</span>
            <a 
              href={EXTERNAL_URL}
              onClick={handleWeatherLinkClick}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:text-neon-lime transition-colors font-bold text-sm"
              aria-label="Visit forsyth.k12.us (opens in a new tab)"
            >
              weather man
            </a>
          </div>

          {/* Copyright */}
          <div className="text-textSecondary/60 text-xs">
            © 2026 Forsyth Games. All games remain property of their respective owners.
          </div>

          {/* Powered by Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 rounded-full px-4 py-2">
            <Gamepad2 className="w-4 h-4 text-neon-blue" />
            <span className="text-xs font-semibold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Powered by Next.js & Framer Motion
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
