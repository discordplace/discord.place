import pgk from '@next/bundle-analyzer';
const withBundleAnalyzer = pgk;

/** @type {import('next').NextConfig} */

const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})({
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/:path*' : 'https://api.discord.place/:path*'
      }
    ];
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.discord.place'
      }
    ]
  }
});

export default nextConfig;
