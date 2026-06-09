import Hero from '@/app/(emojis)/emojis/components/Hero';

export const metadata = {
  description: 'Explore, find and download the perfect emoji for your Discord server!',
  openGraph: {
    description: 'Explore, find and download the perfect emoji for your Discord server!',
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
    title: 'Discord Place - Emojis',
    type: 'website',
    url: 'https://discord.place/emojis'
  },
  title: 'Emojis'
};

export default function Page() {
  return <Hero />;
}