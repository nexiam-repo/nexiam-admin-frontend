import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*', // Applies to all routes
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', // 1 year, with subdomains and preload
          },
          // Add any other security headers here
        ],
      },
    ];
  },
};

export default nextConfig;
