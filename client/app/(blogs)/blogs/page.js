import Hero from '@/app/(blogs)/blogs/Hero';

export const metadata = {
  description: 'The latest news, updates and guides from the Discord Place team.',
  openGraph: {
    description: 'The latest news, updates and guides from the Discord Place team.',
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