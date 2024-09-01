import getSound from '@/lib/request/sounds/getSound';
import { redirect } from 'next/navigation';
import Content from '@/app/(sounds)/sounds/[id]/content';
import getSoundMetadata from '@/lib/request/sounds/getSoundMetadata';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getSoundMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  console.log(`${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'sound', metadata }))}`)

  return {
    title: `Sound ${metadata.name}`,
    keywords: [
      metadata.name,
      `discord sound ${metadata.name}`,
      `discord soundboard ${metadata.name}`,
      `discord ${metadata.name} download`,
      `discord ${metadata.name} upload`,
      `${metadata.name} download`
    ],
    openGraph: {
      title: `Discord Place - Sound ${metadata.name}`,
      url: `/sounds/${params.id}`,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'sound', metadata }))}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const sound = await getSound(params.id).catch(error => error);
  if (typeof sound === 'string') return redirect(`/error?message=${encodeURIComponent(sound)}`);
  
  return <Content sound={sound} />;
}