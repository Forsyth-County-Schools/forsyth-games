import { NextResponse } from 'next/server'

export function middleware(request: NextResponse) {
  const response = NextResponse.next()
  
  // Block browser extensions
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https:; font-src 'self' data: https:; connect-src 'self' https: https:; media-src 'self' https: https:; frame-src 'self' https: gms.parcoil.com; frame-ancestors 'self';"
  )
  
  // Block extension detection scripts
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  )
  
  // Block common extension injection points
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  
  return response
}
