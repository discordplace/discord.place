import Hero from '@/app/(bots)/bots/components/Hero';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Browse and find the perfect bot for your Discord server!',
  keywords: [
    'discord bots',
    'best discord bots',
    'cool discord bots',
    'unique discord bots',
    'useful discord bots',
    'fun discord bots',
    'discord bot list',
    'browse discord bots',
    'find discord bots'
  ],
  title: 'Discover Bots'
});

export default function Page() {
  return <Hero />;
}