import pgk from '@next/bundle-analyzer';
const withBundleAnalyzer = pgk;

/** @type {import('next').NextConfig} */

const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})({
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
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://api.discord.place/sitemap.xml'
      }
    ];
  }
});

export default nextConfig;
