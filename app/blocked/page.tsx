import { cookies } from 'next/headers'
import RegionLock from '@/components/RegionLock'

export default async function BlockedPage() {
  // Get region info from cookies if available
  const cookieStore = await cookies()
  const regionCookie = cookieStore.get('geo-region')
  const countryCookie = cookieStore.get('geo-country')

  return (
    <RegionLock 
      region={regionCookie?.value} 
      country={countryCookie?.value}
    />
  )
}
