import Hero from '@/app/(bots)/bots/components/Hero';

export const metadata = {
  title: 'Bots',
  description: 'Browse and find the perfect bot for your Discord server!',
  openGraph: {
    title: 'Discord Place - Bots',
    description: 'Browse and find the perfect bot for your Discord server!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/bots',
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