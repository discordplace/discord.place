import Content from '@/app/(themes)/themes/content';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Discover the best two-color combinations to make your Discord profile stand out.',
  keywords: ['discord themes', 'color combinations', 'profile customization', 'discord profile themes', 'best discord themes'],
  title: 'Discover Themes'
});

export default function Page() {
  return <Content />;
}