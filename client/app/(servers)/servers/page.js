import Hero from '@/app/(servers)/servers/components/Hero';

export const metadata = {
  description: 'Find, share and explore the best servers and communities on Discord!',
  openGraph: {
    description: 'Find, share and explore the best servers and communities on Discord!',
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        alt: 'Discord Place'
      }
    ],
    locale: 'en_US',
    site_name: 'Discord Place',
    title: 'Discord Place - Servers',
    type: 'website',
    url: 'https://discord.place/servers'
  },
  title: 'Servers'
};

export default function Page() {
  return <Hero />;
}