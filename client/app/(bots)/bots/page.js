import Hero from '@/app/(bots)/bots/components/Hero';

export const metadata = {
  description: 'Browse and find the perfect bot for your Discord server!',
  openGraph: {
    description: 'Browse and find the perfect bot for your Discord server!',
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
    title: 'Discord Place - Bots',
    type: 'website',
    url: 'https://discord.place/bots'
  },
  title: 'Bots'
};

export default function Page() {
  return <Hero />;
}