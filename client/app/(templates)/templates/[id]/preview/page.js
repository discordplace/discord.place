import getTemplate from '@/lib/request/templates/getTemplate';
import { redirect } from 'next/navigation';
import Content from '@/app/(templates)/templates/[id]/preview/content';

export async function generateMetadata({ params }) {
  const template = await getTemplate(params.id).catch(error => error);
  if (typeof template === 'string') return;

  return {
    title: `Template ${template.name} by @${template.user.username}`,
    openGraph: {
      title: `Discord Place - Template ${template.name} by @${template.user.username}`
    }
  };
}

export default async function Page({ params }) {
  const template = await getTemplate(params.id).catch(error => error);
  if (typeof template === 'string') return redirect(`/error?message=${encodeURIComponent(template)}`);
  
  return <Content template={template} />;
}