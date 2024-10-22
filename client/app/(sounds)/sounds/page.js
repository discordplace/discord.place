import Content from '@/app/(sounds)/sounds/content';

export const metadata = {
  title: 'Sounds',
  description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
  openGraph: {
    title: 'Discord Place - Sounds',
    description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/sounds',
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
  return <Content />;
}