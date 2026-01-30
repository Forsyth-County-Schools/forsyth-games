# Forsyth Games - Modern Next.js Edition

A modern, responsive unblocked games site built with Next.js 14 and React 18, featuring a dark theme and clean UI.

## 🎮 Features

- **293 Games** - All existing games preserved and organized
- **Modern UI** - Dark theme with smooth animations and hover effects
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Search Functionality** - Find games instantly with real-time search
- **Clean Navigation** - Intuitive layout with categories and filters
- **Offline Support** - Works locally without internet connection
- **Performance Optimized** - Fast loading and smooth interactions

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
forsyth-games/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── play/
│       └── page.tsx       # Game play page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation bar
│   ├── GameCard.tsx       # Game card component
│   └── Footer.tsx         # Footer component
├── config/               # Configuration and data
│   ├── games.json        # Game data (293 games)
│   ├── main.css          # Legacy styles
│   └── main.js           # Legacy scripts
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, perfect for GitHub Pages or Netlify.

## 🎯 How Games Work

### Game Integration
- Games are loaded via iframe from `https://gms.parcoil.com`
- Each game has metadata in `config/games.json`:
  ```json
  {
    "name": "Game Name",
    "image": "logo.png",
    "url": "game-url",
    "new": false
  }
  ```

### Game URLs
- Home page: `/` - Shows all games in a responsive grid
- Play page: `/play?gameurl=game-url/` - Loads game in iframe
- Search: Real-time filtering as you type

### Adding New Games
1. Add game data to `config/games.json`
2. Ensure game assets are available on the game server
3. Game will automatically appear in the grid

## 🎨 Design System

### Colors
- **Background**: `#0f0f0f` - Dark background
- **Surface**: `#1a1a1a` - Card backgrounds
- **Surface Hover**: `#252525` - Hover states
- **Accent**: `#4b87f7` - Primary accent color
- **Text Primary**: `#ffffff` - Main text
- **Text Secondary**: `#b0b0b0` - Secondary text

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales properly on all devices

### Animations
- **Hover Effects**: Smooth scale and color transitions
- **Loading States**: Spinner animations
- **Micro-interactions**: Button and card hover states

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1-2 columns)
- **Tablet**: 768px - 1024px (3-4 columns)
- **Desktop**: > 1024px (5 columns)

## 🔄 Migration from Original

The original site has been completely modernized while preserving:

✅ **All 293 games** - No games were removed
✅ **Original game URLs** - Games load from same server
✅ **Search functionality** - Enhanced with better UX
✅ **Parcoil attribution** - Footer credit maintained
✅ **Offline capability** - Works without internet

### What's New:
- 🎨 Modern dark theme UI
- 📱 Fully responsive design
- ⚡ Better performance
- 🔍 Enhanced search
- 🎯 Improved navigation
- 🛠️ TypeScript support

## 🌐 Deployment

### GitHub Pages
1. Run `npm run build`
2. Deploy `out/` directory to GitHub Pages
3. Enable GitHub Pages in repository settings

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`

### Vercel
1. Import repository to Vercel
2. Auto-deployment on push to main

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project maintains the same license as the original. Please keep the "a site by parcoil network" attribution as required by the terms of service.

## 🙏 Acknowledgments

- **Parcoil Network** - Original site template and game hosting
- **Next.js Team** - Excellent React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library

---

Built with ❤️ for students who need quality gaming during breaks!
