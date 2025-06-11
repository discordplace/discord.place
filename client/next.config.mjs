import pgk from '@next/bundle-analyzer';
const withBundleAnalyzer = pgk({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'cdn.discordapp.com'
  }
];

if (process.env.NEXT_PUBLIC_CDN_URL) {
  try {
    const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_URL);
    remotePatterns.push({
      protocol: cdnUrl.protocol.replace(':', ''),
      hostname: cdnUrl.hostname
    });
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_CDN_URL. Please check your environment variable.');
  }
}

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns
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

export default withBundleAnalyzer(nextConfig);