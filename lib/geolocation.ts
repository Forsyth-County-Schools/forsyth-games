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
 * Normalize region detection across different geolocation services
 */
function normalizeRegion(region: string, countryCode: string): string {
  if (countryCode === 'US') {
    // Handle various formats for Georgia
    if (region === 'GA' || region === 'Georgia' || region === 'georgia') {
      return 'Georgia';
    }
  }
  return region;
}

/**
 * Check if the user's IP address is from Georgia (US)
 * This function should be called server-side for security
 */
export async function checkGeorgiaLocation(ip?: string): Promise<GeolocationResponse> {
  try {
    // Check for development bypass flag
    const devBypass = process.env.DEV_BYPASS_GEOLOCATION === 'true'
    
    // In development with bypass flag, simulate Georgia location
    if (process.env.NODE_ENV === 'development' && devBypass) {
      return {
        isGeorgia: true,
        region: 'Georgia',
        country: 'US',
        city: 'Alpharetta'
      }
    }

    // Use multiple geolocation services for accuracy with timeouts
    const services = [
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(`https://ipapi.co/${ip || ''}/json/`, {
            headers: { 'User-Agent': 'forsyth-games' },
            signal: controller.signal
          })
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error('ipapi.co failed')
          const data = await response.json()
          const normalizedRegion = normalizeRegion(data.region || data.region_code, data.country_code);
          return {
            isGeorgia: data.country_code === 'US' && normalizedRegion === 'Georgia',
            region: data.region,
            country: data.country_code,
            city: data.city
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      },
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(`https://ip-api.com/json/${ip || ''}`, {
            signal: controller.signal
          })
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error('ip-api.com failed')
          const data = await response.json()
          const normalizedRegion = normalizeRegion(data.region, data.countryCode);
          return {
            isGeorgia: data.countryCode === 'US' && normalizedRegion === 'Georgia',
            region: data.region,
            country: data.countryCode,
            city: data.city
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      },
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(`https://ipinfo.io/${ip || ''}/json`, {
            signal: controller.signal
          })
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error('ipinfo.io failed')
          const data = await response.json()
          const normalizedRegion = normalizeRegion(data.region, data.country);
          return {
            isGeorgia: data.country === 'US' && normalizedRegion === 'Georgia',
            region: data.region,
            country: data.country,
            city: data.city
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }
    ]

    // Try each service in order with retry logic for transient failures
    for (const service of services) {
      let retries = 2;
      while (retries > 0) {
        try {
          const result = await service();
          console.log(`Geolocation result:`, result);
          return result;
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.warn('Geolocation service failed after retries, trying next...', error);
            break;
          }
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If all services fail, deny access for security
    console.error('All geolocation services failed');
    return {
      isGeorgia: false,
      error: 'Unable to verify location'
    }
  } catch (error) {
    console.error('Geolocation check failed:', error);
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
