import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/play(.*)',
  '/welcome(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();
  
  // Block browser extensions - Apply Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.com https://va.vercel-scripts.com blob:; worker-src 'self' blob:; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://img.clerk.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://clerk.accounts.dev https://*.clerk.accounts.dev; media-src 'self' https:; frame-src 'self' https://gms.parcoil.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.app; frame-ancestors 'self';"
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
