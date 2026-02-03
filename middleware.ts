import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // All games now served through Vercel API routes - no external server needed
  // Games are proxied through /api/game which fetches from GitHub
  
  // Extremely permissive Content Security Policy to allow all JavaScript including eval
  // This allows games to load external resources, scripts, styles, and use eval/inline scripts
  // WARNING: This configuration is very permissive and reduces security protections
  const cspDirectives = [
    // Allow everything from all sources
    `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:`,
    // Script sources - allow all sources, inline, and eval
    `script-src * 'unsafe-inline' 'unsafe-eval' data: blob:`,
    // Worker sources - allow all sources
    `worker-src * blob: data:`,
    // Object sources - for Flash/Unity games
    `object-src * data: blob:`,
    // Style sources - allow all sources and inline styles
    `style-src * 'unsafe-inline' data: blob:`,
    // Image sources - allow all sources
    `img-src * data: blob:`,
    // Font sources - allow all sources
    `font-src * data: blob:`,
    // Connect sources - allow all sources including WebSocket
    `connect-src * wss: ws: blob: data:`,
    // Media sources - allow all sources
    `media-src * blob: data:`,
    // Frame sources - allow all sources
    `frame-src * blob: data:`,
    // Child sources - allow all sources
    `child-src * blob: data:`,
    // Allow framing from any source
    `frame-ancestors *`,
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
