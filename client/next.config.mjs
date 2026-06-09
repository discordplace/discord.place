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
  } catch  {
    console.error('Invalid NEXT_PUBLIC_CDN_URL. Please check your environment variable.');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['react-icons']
  },
  images: {
    remotePatterns
  },
  reactStrictMode: false,
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