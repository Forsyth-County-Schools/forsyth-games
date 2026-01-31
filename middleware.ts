import { NextResponse } from 'next/server'

export function middleware(request: NextResponse) {
  const response = NextResponse.next()
  
  // Block browser extensions
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https: https: font-src 'self' data: https: https: connect-src 'self' https: https: media-src 'self' https: https: frame-src 'self' https: gms.parcoil.com; frame-ancestors 'self';"
  )
  
  // Block specific domains
  const blockedDomains = [
    // Linewize/Qoria domains
    'linewize.com',
    'linewize.io',
    'linewize.net',
    'qoria.com',
    'qoria.cloud',
    'qoriaapis.cloud',
    'us.classwize.qoria.cloud',
    'us.schoolmanager.qoria.cloud',
    // Classwize specific domains
    'ably.io',
    'ably-realtime.com',
    'xirsys.com',
    'stream-io-api.com',
    'stream-io-video.com',
    'stream-io-cdn.com',
    'getstream.io',
    // Additional blocking
    'infpabiiejbjobcphaomiifjibpkjlf',
  ]
  
  // Create CSP with blocked domains
  const blockedDomainsList = blockedDomains.join(' ')
  
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https: https: font-src 'self' data: https: https: connect-src 'self' https: https: media-src 'self' https: https: frame-src 'self' https: gms.parcoil.com; frame-ancestors 'self'; block-all mixed-content; block-all mixed-content; block-all blob: data: https: https: block-all ${blockedDomainsList};`
  )
  
  // Block specific extension
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  )
  
  // Block common extension injection points
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  
  // Block Classwize specific extension
  response.headers.set(
    'X-Extension-ID',
    'block:infpabiiejbjobcphaomiifjibpkjlf'
  )
  
  return response
}
