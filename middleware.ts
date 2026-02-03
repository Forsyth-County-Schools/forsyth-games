import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Game backend server URL
  const gameServerUrl = 'https://forsyth-games.onrender.com';
  
  // Relaxed Content Security Policy for better game compatibility
  // Games require permissive policies to load external resources, scripts, and styles
  // Note: This CSP is intentionally permissive because games from various sources
  // need to load scripts, styles, images, and other resources dynamically
  const cspDirectives = [
    // Default: allow self, HTTPS, data URIs, blobs, and the game server
    `default-src 'self' ${gameServerUrl} https: data: blob:`,
    // Script sources - allow self, inline, eval (required for games), and HTTPS
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${gameServerUrl} https: blob: data:`,
    // Worker sources - games may use web workers
    `worker-src 'self' ${gameServerUrl} blob: https:`,
    // Object sources - for Flash/Unity games
    `object-src 'self' ${gameServerUrl} https: data: blob:`,
    // Style sources - games inject styles dynamically
    `style-src 'self' 'unsafe-inline' ${gameServerUrl} https:`,
    // Image sources - allow HTTPS and data URIs for game assets
    `img-src 'self' ${gameServerUrl} data: https: blob:`,
    // Font sources
    `font-src 'self' ${gameServerUrl} data: https:`,
    // Connect sources - allow HTTPS and secure WebSocket connections
    `connect-src 'self' ${gameServerUrl} https: wss: blob: data:`,
    // Media sources - for game audio/video
    `media-src 'self' ${gameServerUrl} https: blob: data:`,
    // Frame sources - allow games from HTTPS sources and the game server
    `frame-src 'self' ${gameServerUrl} https: blob: data:`,
    // Child sources - for nested workers and frames
    `child-src 'self' ${gameServerUrl} https: blob:`,
    // Allow framing from self only
    "frame-ancestors 'self'"
  ]
  
  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )
  
  // Basic security headers
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  )
  
  response.headers.set(
    'Referrer-Policy',
    'no-referrer-when-downgrade'
  )
  
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
