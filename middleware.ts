import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkGeorgiaLocation, getClientIp } from './lib/geolocation';

// Cache duration for geolocation checks (1 hour)
const GEO_CACHE_DURATION_MS = 60 * 60 * 1000;

const isPublicRoute = createRouteMatcher([
  '/',
  '/play(.*)',
  '/welcome(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/blocked(.*)', // Allow access to blocked page
]);

// Routes that should bypass region check (API routes)
const isApiRoute = createRouteMatcher([
  '/api(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
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
        const clientIp = getClientIp(request.headers);
        const location = await checkGeorgiaLocation(clientIp);
        
        // Set cookies with location info
        const redirectResponse = location.isGeorgia 
          ? NextResponse.next() 
          : NextResponse.redirect(new URL('/blocked', request.url));
        
        // Set geo cookies with cache duration
        const cookieExpiry = new Date(Date.now() + GEO_CACHE_DURATION_MS);
        redirectResponse.cookies.set('geo-checked', 'true', { expires: cookieExpiry });
        redirectResponse.cookies.set('geo-allowed', location.isGeorgia ? 'true' : 'false', { expires: cookieExpiry });
        
        if (location.region) {
          redirectResponse.cookies.set('geo-region', location.region, { expires: cookieExpiry });
        }
        if (location.country) {
          redirectResponse.cookies.set('geo-country', location.country, { expires: cookieExpiry });
        }
        
        // If not in Georgia, redirect to blocked page
        if (!location.isGeorgia) {
          return redirectResponse;
        }
        
        // Copy the geo cookies to the next response
        response.cookies.set('geo-checked', 'true', { expires: cookieExpiry });
        response.cookies.set('geo-allowed', 'true', { expires: cookieExpiry });
        if (location.region) {
          response.cookies.set('geo-region', location.region, { expires: cookieExpiry });
        }
        if (location.country) {
          response.cookies.set('geo-country', location.country, { expires: cookieExpiry });
        }
      }
    }
  }
  
  // Block browser extensions - Apply Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.com https://va.vercel-scripts.com blob:; worker-src 'self' blob:; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://img.clerk.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://clerk.accounts.dev https://*.clerk.accounts.dev https://vitals.vercel-insights.com; media-src 'self' https:; frame-src 'self' https://gms.parcoil.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.app; frame-ancestors 'self';"
  );
  
  // Block specific extension
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  );
  
  // Block common extension injection points
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );
  
  // Block Classwize specific extension
  response.headers.set(
    'X-Extension-ID',
    'block:infpabiiejbjobcphaomiifjibpkjlf'
  );
  
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
