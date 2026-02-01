import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ScrollToTop from '@/components/ScrollToTop'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Force dynamic rendering for all pages since we use Clerk authentication
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Forsyth Games - Educational Games for Students',
  description: 'A curated collection of 293+ educational and brain-training games designed for students. Perfect for school breaks, study breaks, and educational entertainment. Safe, fun, and engaging games that help develop critical thinking, problem-solving, and cognitive skills.',
  keywords: [
    'educational games',
    'student games',
    'school games',
    'learning games',
    'brain training',
    'educational entertainment',
    'student activities',
    'safe games for students',
    'cognitive development',
    'problem solving games',
    'educational technology',
    'classroom games',
    'study break games',
    'interactive learning',
    'educational gaming'
  ],
  authors: [{ name: 'Forsyth County Schools' }],
  creator: 'Forsyth County Schools',
  publisher: 'Forsyth County Schools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://forsyth-games.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Forsyth Games - Educational Games for Students',
    description: '293+ educational games designed for students. Safe, fun, and engaging games that help develop critical thinking, problem-solving, and cognitive skills.',
    url: 'https://forsyth-games.vercel.app',
    siteName: 'Forsyth Games',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Forsyth Games - Educational Gaming Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forsyth Games - Educational Games for Students',
    description: '293+ educational games designed for students. Safe, fun, and engaging games that help develop critical thinking skills.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'education',
  classification: 'Educational Content',
  rating: 'general',
  language: 'en',
  geoRegion: 'US',
  targetAudience: 'students, teachers, parents, educators',
  educationalUse: 'instruction, recreation, cognitive development',
  learningResourceType: 'interactive resource, educational game',
  interactivityType: 'active',
  typicalAgeRange: '8-18',
  timeRequired: 'PT5M',
  accessMode: ['visual', 'textual'],
  accessibilityFeature: ['navigation', 'readingOrder'],
  accessibilityHazard: 'none',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#000000" />
          <meta name="application-name" content="Forsyth Games" />
          <meta name="apple-mobile-web-app-title" content="Forsyth Games" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="referrer" content="no-referrer-when-downgrade" />
          <meta name="format-detection" content="telephone=no" />
          
          {/* Extension Policy */}
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.com https://va.vercel-scripts.com blob:; worker-src 'self' blob:; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://img.clerk.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://clerk.accounts.dev https://*.clerk.accounts.dev https://vitals.vercel-insights.com; media-src 'self' https:; frame-src 'self' https://gms.parcoil.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.app https://www.youtube.com https://www.youtube-nocookie.com;" />
          
          {/* Structured Data for Education */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Forsyth County Schools",
                "description": "Educational gaming platform offering 293+ brain-training games for students",
                "url": "https://forsyth-games.vercel.app",
                "sameAs": [],
                "educationalUse": "instruction, recreation, cognitive development",
                "learningResourceType": "interactive resource, educational game",
                "typicalAgeRange": "8-18",
                "targetAudience": {
                  "@type": "EducationalAudience",
                  "educationalRole": "student"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                },
                "mainEntity": {
                  "@type": "ItemList",
                  "name": "Educational Games Collection",
                  "description": "Collection of 293+ educational games for students",
                  "numberOfItems": 293,
                  "itemListElement": [
                    {
                      "@type": "Game",
                      "name": "Educational Games",
                      "description": "Brain training and educational games",
                      "educationalUse": "cognitive development",
                      "learningResourceType": "interactive resource"
                    }
                  ]
                }
              })
            }}
          />
        </head>
        <body className="font-sans">
          <ScrollToTop />
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
