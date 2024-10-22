import Hero from '@/app/(servers)/servers/components/Hero';

export const metadata = {
  description: 'Find, share and explore the best servers and communities on Discord!',
  openGraph: {
    description: 'Find, share and explore the best servers and communities on Discord!',
    images: [
      {
        alt: 'Discord Place',
        height: 540,
        url: '/og.png',
        width: 960
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