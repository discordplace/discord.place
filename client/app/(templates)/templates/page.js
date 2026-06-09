import Hero from '@/app/(templates)/templates/components/Hero';

export const metadata = {
  description: 'Explore, find and use the perfect template for your Discord server!',
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
    title: 'Discord Place - Templates',
    type: 'website',
    url: 'https://discord.place/templates'
  },
  title: 'Templates'
};

export default function Page() {
  return <Hero />;
}