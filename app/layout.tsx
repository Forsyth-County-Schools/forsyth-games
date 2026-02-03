import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'Canvas Dashboard',
  description: 'Secure classroom chat exclusively for Forsyth County Schools in Georgia',
  keywords: 'classroom, chat, forsyth county schools, education, georgia',
  authors: [{ name: 'Forsyth County Schools IT Department' }],
  robots: 'noindex, nofollow', // Keep private for school use
  icons: {
    icon: 'https://www.csc.edu/media/website/content-assets/images/tlpec/canvas_reversed_logo.png',
  },
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Prevent flash of wrong theme */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              visibility: hidden;
            }
            html.dark {
              visibility: visible;
            }
          `
        }} />
        {/* Content Security Policy for XSS protection */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://ipapi.co https://ipwho.is https://api.ipgeolocation.io https://api.ipify.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://forsyth-chats.onrender.com https://ipapi.co https://ipwho.is https://api.ipgeolocation.io https://api.ipify.org wss: ws:; frame-src 'self' https://gms.parcoil.com https://www.madalingames.com; worker-src 'self' 'unsafe-eval' blob:; child-src 'self' https://gms.parcoil.com https://www.madalingames.com;" 
        />
        {/* Force HTTPS in production */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
              location.replace('https:' + window.location.href.substring(window.location.protocol.length));
            }
          `
        }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force dark mode immediately
                document.documentElement.classList.add('dark');
                
                // Check localStorage for saved preference
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Default to dark if no preference saved
                  localStorage.setItem('theme', 'dark');
                }
                
                // Make page visible
                document.documentElement.style.visibility = 'visible';
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
