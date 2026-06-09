import Hero from '@/app/(servers)/servers/components/Hero';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Find, share and explore the best servers and communities on Discord!',
  title: 'Discover Servers'
});

export default function Page() {
  return <Hero />;
}