import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import Content from '@/app/(servers)/servers/[id]/content';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const server = await getServerMetadata(params.id).catch(error => error);
  if (typeof server === 'string') return;

  return {
    title: `Server ${server.name}`,
    description: server.description,
    openGraph: {
      title: `Discord Place - ${server.name} Server`,
      description: server.description
    }
  };
}

export default async function Page({ params }) {
  const server = await getServer(params.id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);
  
  return <Content server={server} />;
}
