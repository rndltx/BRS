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
            value: '3mb' // Set for chunk size + buffer
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
