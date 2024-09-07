import Hero from '@/app/(blogs)/blogs/Hero';

export const metadata = {
  title: 'Blogs',
  description: 'The latest news, updates and guides from the Discord Place team.',
  openGraph: {
    title: 'Discord Place - Blogs',
    description: 'The latest news, updates and guides from the Discord Place team.',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/blog',
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
  return (
    <Hero />
  );
}