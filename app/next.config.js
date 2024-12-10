/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brs.rizsign.my.id',
        pathname: '/uploads/**',
      }
    ],
    domains: ['rizsign.my.id']
  }
}

module.exports = nextConfig