import Hero from '@/app/(emojis)/emojis/components/Hero';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Explore, find and download the perfect emoji for your Discord server!',
  keywords: [
    'discord emojis',
    'discord emoji packs',
    'custom discord emojis',
    'best discord emojis',
    'cool discord emojis',
    'unique discord emojis',
    'download discord emojis',
    'explore discord emojis',
    'find discord emojis'
  ],
  title: 'Discover Emojis'
});

export default function Page() {
  return <Hero />;
}