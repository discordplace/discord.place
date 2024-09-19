import getTheme from '@/lib/request/themes/getTheme';
import { redirect } from 'next/navigation';
import Content from '@/app/(themes)/themes/[id]/content';
import getThemeMetadata from '@/lib/request/themes/getThemeMetadata';

export async function generateMetadata({ params }) {
  const metadata = await getThemeMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    title: 'Theme',
    keywords: [
      metadata.colors.primary,
      metadata.colors.secondary,
      `discord theme ${metadata.colors.primary}`,
      `discord theme ${metadata.colors.secondary}`,
      `discord profile theme ${metadata.colors.primary}`,
      `discord profile theme ${metadata.colors.secondary}`,
      `discord ${metadata.colors.primary} theme`,
      `discord ${metadata.colors.secondary} theme`
    ],
    openGraph: {
      title: 'Discord Place - Theme',
      url: `/themes/${params.id}`,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const theme = await getTheme(params.id).catch(error => error);
  if (typeof theme === 'string') return redirect(`/error?message=${encodeURIComponent(theme)}`);
  
  return <Content theme={theme} />;
}