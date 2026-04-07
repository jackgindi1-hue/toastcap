/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Increase body size limit for file uploads (default is 1MB)
  // Mobile uploads especially need higher limits
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

module.exports = nextConfig;
