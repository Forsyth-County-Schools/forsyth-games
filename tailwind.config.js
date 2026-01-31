/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Theme
        'deep-space': '#000000',
        'deep-space-dark': '#050505',
        'surface': '#0a0a0a',
        'surface-hover': '#1a1a1a',
        
        // Dynamic Mesh Gradient Colors
        'electric-cyan': '#00F2FF',
        'royal-purple': '#8B5CF6',
        'neon-blue': '#00F2FF',
        'neon-purple': '#8B5CF6',
        'neon-pink': '#EC4899',
        'neon-lime': '#84CC16',
        
        // Text Colors
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',
        'text-muted': '#525252',
        
        // Glass and Border Colors
        'glass': 'rgba(10, 10, 10, 0.4)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-border-hover': 'rgba(255, 255, 255, 0.2)',
        
        // Legacy Colors (for compatibility)
        background: '#000000',
        accent: '#00F2FF',
        accentHover: '#06b6d4',
        primary: '#8B5CF6',
        secondary: '#f472b6',
        textPrimary: '#ffffff',
        textSecondary: '#a1a1aa',
        textMuted: '#525252',
        
        gradient: {
          start: '#000000',
          middle: '#050505',
          end: '#0a0a0a',
        },
        neon: {
          blue: '#00F2FF',
          purple: '#8B5CF6',
          pink: '#EC4899',
          lime: '#84CC16',
        },
      },
      fontFamily: {
        sans: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'deep-space-gradient':
          'radial-gradient(ellipse at top, #000000 0%, #050505 50%, #000000 100%)',
        'mesh-gradient':
          'linear-gradient(135deg, #00F2FF 0%, #8B5CF6 50%, #00F2FF 100%)',
        'aurora-gradient':
          'radial-gradient(ellipse at top left, rgba(0, 242, 255, 0.3) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
        'geometric-grid':
          'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'film-grain':
          'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.02"/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass-hover': '0 12px 48px 0 rgba(0, 242, 255, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'neon-cyan': '0 0 30px rgba(0, 242, 255, 0.5), 0 0 60px rgba(0, 242, 255, 0.2)',
        'neon-purple': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)',
        'neon-lg': '0 0 50px rgba(0, 242, 255, 0.7), 0 0 100px rgba(0, 242, 255, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px rgba(0, 242, 255, 0.2), 0 8px 30px rgba(139, 92, 246, 0.15)',
        'floating': '0 20px 60px rgba(0, 242, 255, 0.15), 0 30px 80px rgba(139, 92, 246, 0.1)',
        'glow': '0 0 80px rgba(0, 242, 255, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'border-sweep': 'border-sweep 2s linear infinite',
        'conic-rotate': 'conic-rotate 3s linear infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'mesh-shift': 'mesh-shift 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'border-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'conic-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'aurora': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0.3 },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)', opacity: 0.5 },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)', opacity: 0.4 },
        },
        'mesh-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
