import { notFound, redirect } from 'next/navigation';

import Content from '@/app/(templates)/templates/[id]/preview/content';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';
import isTemplateId from '@/lib/isTemplateId';
import getTemplate from '@/lib/request/templates/getTemplate';
import getTemplateMetadata from '@/lib/request/templates/getTemplateMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!isTemplateId(id)) notFound();

  const metadata = await getTemplateMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  return createMetadata({
    description: metadata.description,
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'template' }))}`,
          width: 1200
        }
      ]
    },
    title: `Template ${metadata.name} by @${metadata.username}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  if (!isTemplateId(id)) notFound();

  const template = await getTemplate(id).catch(error => error);
  if (typeof template === 'string') return redirect(`/error?message=${encodeURIComponent(template)}`);

  return <Content template={template} />;
}