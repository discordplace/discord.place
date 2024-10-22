import Hero from '@/app/(servers)/servers/components/Hero';

export const metadata = {
  title: 'Servers',
  description: 'Find, share and explore the best servers and communities on Discord!',
  openGraph: {
    title: 'Discord Place - Servers',
    description: 'Find, share and explore the best servers and communities on Discord!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/servers',
    site_name: 'Discord Place',
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        alt: 'Discord Place'
      }
    ]
  }
};

export default function Page() {
  return <Hero />;
}