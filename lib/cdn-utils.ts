// CDN Optimization Utilities for Forsyth Games
// Free CDN services integration

// CDN Configuration
export const CDN_CONFIG = {
  // jsDelivr CDN for GitHub-hosted game assets
  jsDelivr: {
    baseUrl: 'https://cdn.jsdelivr.net',
    githubRepo: 'forsyth-games/game-assets', // Create this repo
    version: 'latest'
  },
  
  // Cloudflare CDN (if you set up Cloudflare)
  cloudflare: {
    baseUrl: 'https://cdn.yourdomain.com', // Your custom CDN domain
  },
  
  // Vercel Edge (already active)
  vercel: {
    baseUrl: 'https://forsyth-games.vercel.app',
  }
}

// Game server with CDN fallback
export const GAME_SERVER_CONFIG = {
  primary: 'https://gms.parcoil.com',
  cdnFallbacks: [
    'https://cdn.jsdelivr.net/gh/forsyth-games/game-assets@latest/games',
    'https://your-cdn-domain.com/games', // Cloudflare custom domain
  ]
}

// Get optimized game URL with CDN fallback
export function getOptimizedGameUrl(gameUrl: string, imageUrl: string): string {
  const primaryUrl = `${GAME_SERVER_CONFIG.primary}/${gameUrl}/${imageUrl}`
  
  return primaryUrl
}

// Preload critical game assets
export function preloadGameAssets(gameUrls: string[]) {
  gameUrls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

// Service Worker for offline game caching
export const SERVICE_WORKER_CONFIG = {
  cacheName: 'forsyth-games-v1',
  gameAssetsCache: 'game-assets-v1',
  staticCache: 'static-v1',
  
  // Cache game assets for offline play
  cacheGameAssets: [
    '/api/games',
    '/images/game-icons/',
    '/game-assets/'
  ]
}

// CDN Performance Monitoring
export class CDNPerformanceMonitor {
  private static instance: CDNPerformanceMonitor
  private metrics: Map<string, number> = new Map()
  
  static getInstance(): CDNPerformanceMonitor {
    if (!CDNPerformanceMonitor.instance) {
      CDNPerformanceMonitor.instance = new CDNPerformanceMonitor()
    }
    return CDNPerformanceMonitor.instance
  }
  
  measureLoadTime(url: string, startTime: number) {
    const loadTime = performance.now() - startTime
    this.metrics.set(url, loadTime)
    
    // Log slow loading assets
    if (loadTime > 2000) {
      console.warn(`Slow asset loading: ${url} took ${loadTime.toFixed(2)}ms`)
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

// Free CDN Service Recommendations
export const CDN_RECOMMENDATIONS = {
  // 1. Cloudflare (Best overall)
  cloudflare: {
    name: 'Cloudflare CDN',
    freeTier: 'Unlimited bandwidth, 100k requests/month',
    setup: 'Point domain to Cloudflare nameservers',
    benefits: ['Global edge locations', 'DDoS protection', 'Auto-optimization'],
    url: 'https://www.cloudflare.com/cdn/'
  },
  
  // 2. jsDelivr (For game assets)
  jsdelivr: {
    name: 'jsDelivr + GitHub',
    freeTier: 'Completely free, no limits',
    setup: 'Upload game files to GitHub, use jsDelivr CDN',
    benefits: ['GitHub integration', 'Multiple CDN endpoints', 'Instant deployment'],
    url: 'https://www.jsdelivr.com/'
  },
  
  // 3. Vercel Edge (Already using)
  vercel: {
    name: 'Vercel Edge Network',
    freeTier: '100GB bandwidth/month',
    setup: 'Already configured with your deployment',
    benefits: ['Next.js optimization', 'Edge functions', 'Automatic deployments'],
    url: 'https://vercel.com/docs/concepts/edge-network/overview'
  },
  
  // 4. Google Cloud CDN
  googleCloud: {
    name: 'Google Cloud CDN',
    freeTier: '$300 credit + 1GB/month free',
    setup: 'Cloud Storage + CDN configuration',
    benefits: ['Google infrastructure', 'Global network', 'Advanced caching'],
    url: 'https://cloud.google.com/cdn'
  }
}

// Quick setup guide
export const CDN_SETUP_GUIDE = {
  cloudflare: `
# Cloudflare Setup for Forsyth Games
1. Sign up at https://www.cloudflare.com/
2. Add your domain (forsyth-games.vercel.app)
3. Update nameservers to Cloudflare
4. Enable:
   - Auto Minify (HTML, CSS, JS)
   - Brotli compression
   - HTTP/2
   - Rocket Loader
5. Set Cache Rules:
   - Cache everything: 1 year
   - Browser cache TTL: 4 hours
   - Edge cache TTL: 1 month
`,
  
  jsdelivr: `
# jsDelivr + GitHub Setup
1. Create GitHub repo: forsyth-games/game-assets
2. Upload game files to repo structure:
   /games/1v1lol/logo.png
   /games/1v1lol/game.js
   /games/minecraft/assets/
3. Access via CDN:
   https://cdn.jsdelivr.net/gh/forsyth-games/game-assets@latest/games/1v1lol/logo.png
4. Update game URLs in components to use CDN
`,
  
  optimization: `
# General CDN Optimizations
1. Enable Gzip/Brotli compression
2. Set proper cache headers
3. Use modern image formats (WebP, AVIF)
4. Implement lazy loading
5. Minify CSS/JS files
6. Use HTTP/2 or HTTP/3
7. Enable HSTS for security
`
}
