import getServer from '@/lib/request/servers/getServer';
import getServerMetadata from '@/lib/request/servers/getServerMetadata';
import Content from '@/app/(servers)/servers/[id]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getServerMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  console.log(metadata);

  return {
    title: `Server ${metadata.name}`,
    description: metadata.description,
    openGraph: {
      title: `Discord Place - ${metadata.name} Server`,
      description: metadata.description,
      url: `${config.baseUrl}/servers/${params.id}`,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'server', metadata }))}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const server = await getServer(params.id).catch(error => error);
  if (typeof server === 'string') return redirect(`/error?message=${encodeURIComponent(server)}`);
  
  return <Content server={server} />;
}
