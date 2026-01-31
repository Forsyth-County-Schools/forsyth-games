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
        background: '#020617',
        surface: '#0f172a',
        surfaceHover: '#1e293b',
        accent: '#22d3ee',
        accentHover: '#06b6d4',
        primary: '#a78bfa',
        secondary: '#f472b6',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
        gradient: {
          start: '#020617',
          middle: '#1e1b4b',
          end: '#0f172a',
        },
        neon: {
          blue: '#22d3ee',
          lime: '#84cc16',
          purple: '#a855f7',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'obsidian-gradient':
          'radial-gradient(ellipse at top, #1e1b4b 0%, #020617 50%, #0f172a 100%)',
        'neon-glow':
          'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 40px 0 rgba(34, 211, 238, 0.25)',
        'neon': '0 0 20px rgba(34, 211, 238, 0.5)',
        'neon-lg': '0 0 40px rgba(34, 211, 238, 0.7)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(34, 211, 238, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
