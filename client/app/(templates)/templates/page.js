import Hero from '@/app/(templates)/templates/components/Hero';

export const metadata = {
  title: 'Templates',
  description: 'Explore, find and use the perfect template for your Discord server!',
  openGraph: {
    title: 'Discord Place - Templates',
    description: 'Explore, find and download the perfect emoji for your Discord server!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/templates',
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