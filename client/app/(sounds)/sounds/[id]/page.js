import Content from '@/app/(sounds)/sounds/[id]/content';
import config from '@/config';
import getSound from '@/lib/request/sounds/getSound';
import getSoundMetadata from '@/lib/request/sounds/getSoundMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getSoundMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    keywords: [
      metadata.name,
      `discord sound ${metadata.name}`,
      `discord soundboard ${metadata.name}`,
      `discord ${metadata.name} download`,
      `discord ${metadata.name} upload`,
      `${metadata.name} download`
    ],
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'sound' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - Sound ${metadata.name}`,
      url: `/sounds/${params.id}`
    },
    title: `Sound ${metadata.name}`
  };
}

export default async function Page({ params }) {
  const sound = await getSound(params.id).catch(error => error);
  if (typeof sound === 'string') return redirect(`/error?message=${encodeURIComponent(sound)}`);

  return <Content sound={sound} />;
}