import Hero from '@/app/(templates)/templates/components/Hero';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Explore, find and use the perfect template for your Discord server!',
  keywords: ['discord templates', 'server templates', 'discord server themes', 'free discord templates', 'best discord templates'],
  title: 'Discover Themes'
});

export default function Page() {
  return <Hero />;
}