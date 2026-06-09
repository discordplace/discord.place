import Content from '@/app/(sounds)/sounds/content';

export const metadata = {
  description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
  openGraph: {
    description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
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
    title: 'Discord Place - Sounds',
    type: 'website',
    url: 'https://discord.place/sounds'
  },
  title: 'Sounds'
};

export default function Page() {
  return <Content />;
}