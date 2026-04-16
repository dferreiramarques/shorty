/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:slug',
        destination: '/:slug',
      },
    ];
  },
};

module.exports = nextConfig;