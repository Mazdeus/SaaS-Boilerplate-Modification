/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CRITICAL: Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Production domain
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  images: {
    domains: ['brodofootwear.studio', 'www.brodofootwear.studio'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brodofootwear.studio',
      },
      {
        protocol: 'https',
        hostname: 'www.brodofootwear.studio',
      },
    ],
  },
};

export default nextConfig;