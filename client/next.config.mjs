import { withSentryConfig } from '@sentry/nextjs';
import pgk from '@next/bundle-analyzer';
const withBundleAnalyzer = pgk({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
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
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: 'discordplace',
  project: 'client',
  sentryUrl: 'https://gt.discord.place/',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true
});