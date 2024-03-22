import Hero from '@/app/(emojis)/emojis/components/Hero';

export const metadata = {
  title: 'Emojis',
  description: 'Explore, find and download the perfect emoji for your Discord server!',
  openGraph: {
    title: 'Discord Place - Emojis',
    description: 'Explore, find and download the perfect emoji for your Discord server!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/emojis',
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