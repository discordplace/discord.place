import Content from '@/app/(sounds)/sounds/content';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Explore, find and download the perfect sounds for your Discord server soundboard!',
  keywords: ['discord soundboard', 'discord sounds', 'free discord sounds', 'best discord sounds', 'custom discord sounds'],
  title: 'Discover Sounds'
});

export default function Page() {
  return <Content />;
}