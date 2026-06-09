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
    optimizePackageImports: ['react-icons']
  },
  images: {
    remotePatterns
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        destination: '/profile/:slug',
        permanent: true,
        source: '/p/:slug'
      }
    ]
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
  }
};

export default nextConfig;