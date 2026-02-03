/**
 * Geolocation utility
 * 
 * NOTE: Geolocation blocking is currently DISABLED - all users are allowed access
 */

export interface GeolocationResponse {
  isGeorgia: boolean
  region?: string
  country?: string
  city?: string
  error?: string
}

/**
 * Check user location access
 * 
 * NOTE: Geolocation blocking is currently DISABLED.
 * This function always returns isGeorgia: true to allow all users access.
 * The region, country, and city fields are undefined since no location check is performed.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkGeorgiaLocation(_ip?: string): Promise<GeolocationResponse> {
  // Geolocation blocking is disabled - allow all users
  return {
    isGeorgia: true
  }
}

/**
 * Extract IP address from request headers
 */
export function getClientIp(headers: Headers): string | undefined {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return undefined
}
