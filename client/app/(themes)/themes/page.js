import Content from '@/app/(themes)/themes/content';

export const metadata = {
  title: 'Themes',
  description: 'Discover the best two-color combinations to make your Discord profile stand out.',
  openGraph: {
    title: 'Discord Place - Themes',
    description: 'Discover the best two-color combinations to make your Discord profile stand out.',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/themes',
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