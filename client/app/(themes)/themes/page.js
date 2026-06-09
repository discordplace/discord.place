import Content from '@/app/(themes)/themes/content';

export const metadata = {
  description: 'Discover the best two-color combinations to make your Discord profile stand out.',
  openGraph: {
    description: 'Discover the best two-color combinations to make your Discord profile stand out.',
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
    title: 'Discord Place - Themes',
    type: 'website',
    url: 'https://discord.place/themes'
  },
  title: 'Themes'
};

export default function Page() {
  return <Content />;
}