import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkGeorgiaLocation, getClientIp } from './lib/geolocation';

// Cache duration for geolocation checks (1 hour)
const GEO_CACHE_DURATION_MS = 60 * 60 * 1000;

// Rate limiting store with size limit to prevent memory leaks
const MAX_CACHE_SIZE = 10000;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired entries and enforce size limit to prevent memory leaks
function cleanupExpiredEntries() {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  
  // Remove expired entries
  for (const [key, record] of entries) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  
  // Enforce size limit
  if (rateLimitStore.size > MAX_CACHE_SIZE) {
    const entriesToRemove = rateLimitStore.size - MAX_CACHE_SIZE;
    const keys = Array.from(rateLimitStore.keys());
    for (let i = 0; i < entriesToRemove; i++) {
      rateLimitStore.delete(keys[i]);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredEntries, 60000);

// Rate limiting: 1000 requests per minute per IP (increased for high traffic)
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = ip;
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (record.count >= 1000) {
    return false;
  }
  
  record.count++;
  return true;
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/play(.*)',
  '/welcome(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/blocked(.*)', // Allow access to blocked page
  '/settings(.*)', // Allow access to settings page
  '/youtube(.*)', // Allow access to youtube page
]);

// Routes that should bypass region check (API routes)
const isApiRoute = createRouteMatcher([
  '/api(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Get client IP for rate limiting and logging
  const clientIp = getClientIp(request.headers) || 'unknown';
  
  // Apply rate limiting to all routes except blocked page
  if (request.nextUrl.pathname !== '/blocked' && !checkRateLimit(clientIp)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Clerk authentication check
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();
  
  // Region lock - only apply to non-API routes
  if (!isApiRoute(request)) {
    const pathname = request.nextUrl.pathname;
    
    // Don't check on blocked page to avoid redirect loop
    if (pathname !== '/blocked') {
      // Check if we already have a valid Georgia check in cookies
      const geoChecked = request.cookies.get('geo-checked');
      const geoAllowed = request.cookies.get('geo-allowed');
      
      // Only verify location if not already checked with valid allowed status
      if (!geoChecked || geoAllowed?.value !== 'true') {
        const location = await checkGeorgiaLocation(clientIp);
        
        // Log location check for security monitoring
        console.log(`Location check for IP ${clientIp}:`, {
          isGeorgia: location.isGeorgia,
          region: location.region,
          country: location.country,
          city: location.city
        });
        
        // Set cookies with location info - batch operations to avoid race conditions
        const cookieExpiry = new Date(Date.now() + GEO_CACHE_DURATION_MS);
        const finalResponse = location.isGeorgia 
          ? NextResponse.next() 
          : NextResponse.redirect(new URL('/blocked', request.url));
        
        // Batch set all cookies at once to prevent race conditions
        finalResponse.cookies.set('geo-checked', 'true', { 
          expires: cookieExpiry,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        finalResponse.cookies.set('geo-allowed', location.isGeorgia ? 'true' : 'false', { 
          expires: cookieExpiry,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        if (location.region) {
          finalResponse.cookies.set('geo-region', location.region, { 
            expires: cookieExpiry,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
        if (location.country) {
          finalResponse.cookies.set('geo-country', location.country, { 
            expires: cookieExpiry,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
        
        // Return the final response with cookies
        return finalResponse;
      }
    }
  }
  
  // Block browser extensions and monitoring services - Apply Content Security Policy
  // This CSP blocks Linewize, Qoria, Classwize, Smoothwall, FamilyZone, and related services
  // while maintaining normal site functionality
  const cspDirectives = [
    "default-src 'self'",
    // Script sources - allow self, inline (for Next.js), eval (for dev), and required CDNs
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.com https://va.vercel-scripts.com blob:",
    // Worker sources
    "worker-src 'self' blob:",
    // Object sources - restrict to self only
    "object-src 'self'",
    // Style sources
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Image sources - allow data URIs, HTTPS, and required services
    "img-src 'self' data: https: blob: https://img.clerk.com https://site.imsglobal.org",
    // Font sources
    "font-src 'self' data: https://fonts.gstatic.com",
    // Connect sources - explicit allowlist (blocks monitoring services by omission)
    "connect-src 'self' https://clerk.accounts.dev https://*.clerk.accounts.dev https://vitals.vercel-insights.com https://gms.parcoil.com",
    // Media sources
    "media-src 'self' https://gms.parcoil.com",
    // Frame sources - allow required iframes but block monitoring/filtering services
    "frame-src 'self' https://gms.parcoil.com https://forsyth-games.onrender.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.app https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com",
    // Prevent this site from being framed by others
    "frame-ancestors 'self'"
  ]
  
  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )
  
  // Additional security headers to block monitoring/filtering services
  
  // Prevent MIME type sniffing
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  )
  
  // Control referrer information
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  
  // Permissions Policy - block camera, microphone, screen capture, and other monitoring features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), display-capture=(), screen-wake-lock=(), geolocation=(), payment=(), usb=()'
  )
  
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
