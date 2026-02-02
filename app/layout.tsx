import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ScrollToTop from '@/components/ScrollToTop'
import ExtensionBlocker from '@/components/ExtensionBlocker'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Force dynamic rendering for all pages since we use Clerk authentication
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Forsyth Games - Educational Gaming Platform | Forsyth County Schools',
  description: 'Official Forsyth County Schools educational gaming platform featuring 255+ curriculum-aligned games. Designed to enhance student learning through interactive gameplay, critical thinking exercises, and brain-training activities. Safe, monitored, and educationally approved for K-12 students.',
  keywords: [
    'Forsyth County Schools',
    'educational games',
    'student learning',
    'K-12 education',
    'curriculum games',
    'brain training',
    'cognitive development',
    'problem solving skills',
    'educational technology',
    'interactive learning',
    'study break activities',
    'classroom resources',
    'safe student games',
    'learning games',
    'educational entertainment',
    'STEM games',
    'math games',
    'reading games',
    'science games',
    'critical thinking',
    'student engagement',
    'digital learning',
    'educational gaming platform',
    'school approved games'
  ],
  authors: [{ name: 'Forsyth County Schools', url: 'https://www.forsyth.k12.ga.us' }],
  creator: 'Forsyth County Schools District',
  publisher: {
    name: 'Forsyth County Schools',
    url: 'https://www.forsyth.k12.ga.us',
    logo: {
      url: 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png',
      width: 512,
      height: 512,
    },
  },
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
    title: 'Forsyth Games - Educational Gaming Platform | Forsyth County Schools',
    description: 'Official Forsyth County Schools educational platform with 255+ curriculum-aligned games. Enhance student learning through interactive gameplay and critical thinking exercises.',
    url: 'https://forsyth-games.vercel.app',
    siteName: 'Forsyth Games - Forsyth County Schools',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Forsyth Games - Educational Gaming Platform by Forsyth County Schools',
      },
      {
        url: 'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png',
        width: 512,
        height: 512,
        alt: 'Forsyth County Schools Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
    educationalUse: 'instruction',
    learningResourceType: 'interactive resource',
    typicalAgeRange: '5-18',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forsyth Games - Educational Gaming Platform | Forsyth County Schools',
    description: 'Official Forsyth County Schools platform with 255+ curriculum-aligned educational games for K-12 students.',
    images: [
      '/og-image.jpg',
      'https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png'
    ],
    site: '@ForsythCountySchools',
    creator: '@ForsythCountySchools',
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
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
  category: 'education',
  classification: 'Educational Content',
  rating: 'general',
  language: 'en',
  geoRegion: 'US-GA',
  targetAudience: 'students, teachers, parents, educators, K-12, elementary, middle school, high school',
  educationalUse: 'instruction, recreation, cognitive development, assessment, practice',
  learningResourceType: 'interactive resource, educational game, learning tool, assessment',
  interactivityType: 'active',
  typicalAgeRange: '5-18',
  timeRequired: 'PT5M',
  accessMode: ['visual', 'textual', 'auditory'],
  accessibilityFeature: ['navigation', 'readingOrder', 'highContrast'],
  accessibilityHazard: 'none',
  about: [
    'Educational Games',
    'Student Learning',
    'K-12 Education',
    'Interactive Learning',
    'Curriculum Activities'
  ],
  teaches: [
    'Critical Thinking',
    'Problem Solving',
    'Math Skills',
    'Reading Comprehension',
    'Scientific Reasoning',
    'Digital Literacy'
  ],
  inLanguage: 'en-US',
  isFamilyFriendly: true,
  contentRating: 'E',
  genre: ['Education', 'Learning', 'Games', 'Interactive'],
  dateModified: new Date().toISOString(),
  datePublished: '2024-01-01',
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
          
          {/* Performance Optimization - Resource Hints for faster loading on slower computers */}
          <link rel="dns-prefetch" href="https://gms.parcoil.com" />
          <link rel="dns-prefetch" href="https://forsyth-games.onrender.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://gms.parcoil.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://forsyth-games.onrender.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Security Policy - Blocks monitoring/filtering services (Linewize, Qoria, Classwize, etc.) */}
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.com https://va.vercel-scripts.com blob:; worker-src 'self' blob:; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://img.clerk.com https://site.imsglobal.org; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://clerk.accounts.dev https://*.clerk.accounts.dev https://vitals.vercel-insights.com https://gms.parcoil.com; media-src 'self' https:; frame-src 'self' https://gms.parcoil.com https://forsyth-games.onrender.com https://clerk.accounts.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://vercel.live https://*.vercel.app https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com;" />
          <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), display-capture=(), screen-wake-lock=(), geolocation=(), payment=(), usb=()" />
          
          {/* Enhanced Structured Data for Education */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Forsyth County Schools",
                "description": "Forsyth County Schools educational gaming platform featuring 255+ curriculum-aligned games for K-12 students",
                "url": "https://forsyth-games.vercel.app",
                "logo": "https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png",
                "sameAs": [
                  "https://www.forsyth.k12.ga.us"
                ],
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Cumming",
                  "addressRegion": "GA",
                  "addressCountry": "US",
                  "postalCode": "30040"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+1-678-947-2000",
                  "contactType": "educational services",
                  "areaServed": "Forsyth County, Georgia"
                },
                "educationalUse": "instruction, recreation, cognitive development, assessment, practice",
                "learningResourceType": "interactive resource, educational game, learning tool, assessment",
                "typicalAgeRange": "5-18",
                "targetAudience": {
                  "@type": "EducationalAudience",
                  "educationalRole": "student"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "description": "Free access to educational games for K-12 students"
                },
                "mainEntity": {
                  "@type": "ItemList",
                  "name": "Educational Games Collection",
                  "description": "Collection of 255+ curriculum-aligned educational games for K-12 students",
                  "numberOfItems": 204,
                  "itemListElement": [
                    {
                      "@type": "Game",
                      "name": "Educational Games",
                      "description": "Curriculum-aligned educational games for K-12 students",
                      "educationalUse": "cognitive development",
                      "learningResourceType": "interactive resource",
                      "typicalAgeRange": "5-18",
                      "teaches": [
                        "Critical Thinking",
                        "Problem Solving",
                        "Math Skills",
                        "Reading Comprehension",
                        "Scientific Reasoning",
                        "Digital Literacy"
                      ]
                    }
                  ]
                },
                "hasPart": [
                  {
                    "@type": "WebPage",
                    "name": "Game Library",
                    "description": "Browse our collection of educational games",
                    "url": "https://forsyth-games.vercel.app#trending"
                  },
                  {
                    "@type": "WebPage", 
                    "name": "About",
                    "description": "Learn about our educational gaming platform",
                    "url": "https://forsyth-games.vercel.app#home"
                  }
                ],
                "provider": {
                  "@type": "Organization",
                  "name": "Forsyth County Schools",
                  "url": "https://www.forsyth.k12.ga.us"
                },
                "audience": {
                  "@type": "EducationalAudience",
                  "educationalRole": ["student", "teacher", "parent", "educator"]
                },
                "inLanguage": "en-US",
                "isFamilyFriendly": true,
                "contentRating": {
                  "@type": "Rating",
                  "ratingValue": "E",
                  "ratingExplanation": "Everyone - Suitable for all ages"
                }
              })
            }}
          />
          
          {/* Additional Educational Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                "name": "Forsyth Games - Educational Gaming Platform",
                "description": "Official Forsyth County Schools educational platform with 255+ curriculum-aligned games for K-12 students",
                "url": "https://forsyth-games.vercel.app",
                "learningResourceType": "interactive resource, educational game, learning tool",
                "educationalLevel": ["Elementary School", "Middle School", "High School"],
                "about": [
                  "Educational Games",
                  "Student Learning", 
                  "K-12 Education",
                  "Interactive Learning",
                  "Curriculum Activities",
                  "STEM Education",
                  "Brain Training",
                  "Critical Thinking"
                ],
                "teaches": [
                  "Critical Thinking",
                  "Problem Solving", 
                  "Math Skills",
                  "Reading Comprehension",
                  "Scientific Reasoning",
                  "Digital Literacy",
                  "Cognitive Development",
                  "Student Engagement"
                ],
                "audience": {
                  "@type": "EducationalAudience",
                  "educationalRole": ["student", "teacher", "parent", "educator", "administrator"]
                },
                "timeRequired": "PT5M",
                "typicalAgeRange": "5-18",
                "interactivityType": "active",
                "accessMode": ["visual", "textual", "auditory"],
                "accessibilityFeature": ["navigation", "readingOrder", "highContrast"],
                "accessibilityHazard": "none",
                "isFamilyFriendly": true,
                "publisher": {
                  "@type": "Organization",
                  "name": "Forsyth County Schools",
                  "url": "https://www.forsyth.k12.ga.us",
                  "logo": "https://site.imsglobal.org/sites/default/files/orgs/logos/primary/fcslogo_hexagon.png"
                },
                "dateModified": new Date().toISOString(),
                "datePublished": "2024-01-01"
              })
            }}
          />
        </head>
        <body className="font-sans">
          <ScrollToTop />
          <ExtensionBlocker />
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
