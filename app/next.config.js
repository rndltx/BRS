/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/api/videos',
        headers: [
          {
            key: 'x-vercel-max-body-size',
            value: '3mb' // Slightly larger than chunk size
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
