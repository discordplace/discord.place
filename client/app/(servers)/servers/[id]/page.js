import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import Content from '@/app/(servers)/servers/[id]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getServerMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    description: metadata.description,
    openGraph: {
      description: metadata.description,
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'server' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - ${metadata.name} Server`,
      url: `${config.baseUrl}/servers/${id}`
    },
    title: `Server ${metadata.name}`
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  const server = await getServer(id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);

  return <Content server={server} />;
}