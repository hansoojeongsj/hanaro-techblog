import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    typedEnv: true,
  },
  // 필수
  typedRoutes: true,
  images: {
    remotePatterns: [{ hostname: 'picsum.photos' }],
  },
};

export default nextConfig;
