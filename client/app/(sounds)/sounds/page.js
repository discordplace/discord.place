import Content from '@/app/(sounds)/sounds/content';

export const metadata = {
  description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
  openGraph: {
    description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
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
    title: 'Discord Place - Sounds',
    type: 'website',
    url: 'https://discord.place/sounds'
  },
  title: 'Sounds'
};

export default function Page() {
  return <Content />;
}