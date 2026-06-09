import Hero from '@/app/(bots)/bots/components/Hero';

export const metadata = {
  description: 'Browse and find the perfect bot for your Discord server!',
  openGraph: {
    description: 'Browse and find the perfect bot for your Discord server!',
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
    title: 'Discord Place - Bots',
    type: 'website',
    url: 'https://discord.place/bots'
  },
  title: 'Bots'
};

export default function Page() {
  return <Hero />;
}