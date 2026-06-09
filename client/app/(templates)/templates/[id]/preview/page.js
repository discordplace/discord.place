import getTemplate from '@/lib/request/templates/getTemplate';
import getTemplateMetadata from '@/lib/request/templates/getTemplateMetadata';
import { redirect } from 'next/navigation';
import Content from '@/app/(templates)/templates/[id]/preview/content';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getTemplateMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    openGraph: {
      description: metadata.description,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'template', metadata }))}`,
          width: 1200,
          height: 630
        }
      ],
      title: `Discord Place - Template ${metadata.name} by @${metadata.username}`,
      url: `${config.baseUrl}/templates/${params.id}`
    },
    title: `Template ${metadata.name} by @${metadata.username}`
  };
}

export default async function Page({ params }) {
  const template = await getTemplate(params.id).catch(error => error);
  if (typeof template === 'string') return redirect(`/error?message=${encodeURIComponent(template)}`);

  return <Content template={template} />;
}