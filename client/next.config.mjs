import { withSentryConfig } from '@sentry/nextjs';

const remotePatterns = [
  {
    hostname: 'cdn.discordapp.com',
    protocol: 'https'
  }
];

if (process.env.NEXT_PUBLIC_CDN_URL) {
  try {
    const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_URL);
    remotePatterns.push({
      hostname: cdnUrl.hostname,
      protocol: cdnUrl.protocol.replace(':', '')
    });
  } catch {
    console.error('Invalid NEXT_PUBLIC_CDN_URL');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['react-icons'],
    turbopackFileSystemCacheForDev: false
  },
  async headers() {
    return [
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
        source: '/manifest.webmanifest'
      }
    ];
  },
  images: {
    remotePatterns
  },
  logging: {
    browserToTerminal: true
  },
  reactCompiler: true,
  reactStrictMode: false,
  async redirects() {
    return [
      {
        destination: '/profile/:slug',
        permanent: true,
        source: '/p/:slug'
      }
    ];
  },
  async rewrites() {
    return [
      {
        destination: 'https://api.discord.place/sitemap.xml',
        source: '/sitemap.xml'
      }
    ];
  },
  turbopack: {
    root: process.cwd()
  },
  typedRoutes: true
};

export default withSentryConfig(nextConfig, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true
});