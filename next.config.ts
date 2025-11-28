import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error - allowedDevOrigins is valid but missing from types
    allowedDevOrigins: ['localhost:3000', '192.168.1.196:3000']
  }
};

export default nextConfig;
