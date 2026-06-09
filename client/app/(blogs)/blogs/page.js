import Hero from '@/app/(blogs)/blogs/Hero';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'The latest news, updates and guides from the Discord Place team.',
  keywords: [
    'discord place news',
    'discord place updates',
    'discord place guides',
    'discord place announcements',
    'discord place blog',
    'latest news from discord place',
    'latest updates from discord place',
    'latest guides from discord place',
    'latest announcements from discord place'
  ],
  title: 'Blogs'
});

export default function Page() {
  return (
    <Hero />
  );
}