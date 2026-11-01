import { notFound, redirect } from 'next/navigation';

import Content from '@/app/(sounds)/sounds/[id]/content';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';
import isHexId from '@/lib/isHexId';
import getSound from '@/lib/request/sounds/getSound';
import getSoundMetadata from '@/lib/request/sounds/getSoundMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  if (!isHexId(id)) notFound();

  const metadata = await getSoundMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  return createMetadata({
    description: `Download the sound ${metadata.name} for your Discord server soundboard!`,
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
      ]
    },
    title: `Sound ${metadata.name}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  if (!isHexId(id)) notFound();

  const sound = await getSound(id).catch(error => error);
  if (typeof sound === 'string') return redirect(`/error?message=${encodeURIComponent(sound)}`);

  return <Content sound={sound} />;
}