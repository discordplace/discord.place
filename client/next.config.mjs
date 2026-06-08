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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns
  },
  experimental: {
    optimizePackageImports: ['react-icons']
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

export default nextConfig;