import Content from '@/app/(servers)/servers/[id]/content';
import config from '@/config';
import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getServerMetadata(params.id).catch(error => error);
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
      url: `${config.baseUrl}/servers/${params.id}`
    },
    title: `Server ${metadata.name}`
  };
}

export default async function Page({ params }) {
  const server = await getServer(params.id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);

  return <Content server={server} />;
}
