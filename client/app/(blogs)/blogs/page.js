import Hero from '@/app/(blogs)/blogs/Hero';

export const metadata = {
  description: 'The latest news, updates and guides from the Discord Place team.',
  openGraph: {
    description: 'The latest news, updates and guides from the Discord Place team.',
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
    title: 'Discord Place - Blogs',
    type: 'website',
    url: 'https://discord.place/blog'
  },
  title: 'Blogs'
};

export default function Page() {
  return (
    <Hero />
  );
}