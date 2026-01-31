/**
 * Geolocation utility for checking if user is in Georgia (US)
 * Uses IP-based geolocation
 */

export interface GeolocationResponse {
  isGeorgia: boolean
  region?: string
  country?: string
  city?: string
  error?: string
}

/**
 * Check if the user's IP address is from Georgia (US)
 * This function should be called server-side for security
 */
export async function checkGeorgiaLocation(ip?: string): Promise<GeolocationResponse> {
  try {
    // In production, use the actual IP from the request
    // For development/testing, we'll allow all requests
    if (process.env.NODE_ENV === 'development') {
      return {
        isGeorgia: true,
        region: 'Georgia',
        country: 'US',
        city: 'Development Mode'
      }
    }

    // Use a free IP geolocation service
    // Multiple fallback options for reliability
    const services = [
      async () => {
        const response = await fetch(`https://ipapi.co/${ip || ''}/json/`, {
          headers: { 'User-Agent': 'forsyth-games' }
        })
        if (!response.ok) throw new Error('ipapi.co failed')
        const data = await response.json()
        return {
          isGeorgia: data.country_code === 'US' && data.region_code === 'GA',
          region: data.region,
          country: data.country_code,
          city: data.city
        }
      },
      async () => {
        const response = await fetch(`http://ip-api.com/json/${ip || ''}`)
        if (!response.ok) throw new Error('ip-api.com failed')
        const data = await response.json()
        return {
          isGeorgia: data.countryCode === 'US' && data.region === 'GA',
          region: data.region,
          country: data.countryCode,
          city: data.city
        }
      }
    ]

    // Try each service in order
    for (const service of services) {
      try {
        return await service()
      } catch (error) {
        console.warn('Geolocation service failed, trying next...', error)
        continue
      }
    }

    // If all services fail, deny access for security
    return {
      isGeorgia: false,
      error: 'Unable to verify location'
    }
  } catch (error) {
    console.error('Geolocation check failed:', error)
    return {
      isGeorgia: false,
      error: 'Geolocation check failed'
    }
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
