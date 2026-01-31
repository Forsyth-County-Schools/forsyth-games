/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gms.parcoil.com',
      },
      {
        protocol: 'https',
        hostname: 'site.imsglobal.org',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.accounts.dev',
      },
    ],
  },
}

module.exports = nextConfig
