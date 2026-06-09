import getTheme from '@/lib/request/themes/getTheme';
import { redirect } from 'next/navigation';
import Content from '@/app/(themes)/themes/[id]/content';
import getThemeMetadata from '@/lib/request/themes/getThemeMetadata';
import createMetadata from '@/lib/createMetadata';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import config from '@/config';

extend([namesPlugin]);

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getThemeMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  const primaryColor = colord(metadata.colors.primary);
  const secondaryColor = colord(metadata.colors.secondary);

  const primaryName = primaryColor.toName();
  const secondaryName = secondaryColor.toName();

  const keywords = [
    metadata.colors.primary,
    metadata.colors.secondary,
    `discord theme ${metadata.colors.primary}`,
    `discord theme ${metadata.colors.secondary}`,
    `discord profile theme ${metadata.colors.primary}`,
    `discord profile theme ${metadata.colors.secondary}`,
    `discord ${metadata.colors.primary} theme`,
    `discord ${metadata.colors.secondary} theme`,
    ...metadata.categories.flatMap(category => [
      `discord theme ${category.toLowerCase()}`,
      `discord profile theme ${category.toLowerCase()}`,
      `discord ${category.toLowerCase()} theme`
    ])
  ];

  if (primaryName)  keywords.push(`discord theme ${primaryName}`, `discord profile theme ${primaryName}`, `discord ${primaryName} theme`);
  if (secondaryName) keywords.push(`discord theme ${secondaryName}`, `discord profile theme ${secondaryName}`, `discord ${secondaryName} theme`);

  return createMetadata({
    description: `Discover the ${metadata.colors.primary} and ${metadata.colors.secondary} themed Discord profile, perfect for users who love the ${metadata.categories.length > 1 ? metadata.categories.join(', ') : metadata.categories[0]} aesthetic${metadata.categories.length > 1 ? 's' : ''}.`,
    keywords,
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'theme' }))}`,
          width: 1200
        }
      ]
    },
    title: `Theme ${primaryName || metadata.colors.primary} & ${secondaryName || metadata.colors.secondary}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  const theme = await getTheme(id).catch(error => error);
  if (typeof theme === 'string') return redirect(`/error?message=${encodeURIComponent(theme)}`);

  return <Content theme={theme} />;
}