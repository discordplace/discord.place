import Content from '@/app/(themes)/themes/content';

export const metadata = {
  description: 'Discover the best two-color combinations to make your Discord profile stand out.',
  openGraph: {
    description: 'Discover the best two-color combinations to make your Discord profile stand out.',
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
    title: 'Discord Place - Themes',
    type: 'website',
    url: 'https://discord.place/themes'
  },
  title: 'Themes'
};

export default function Page() {
  return <Content />;
}