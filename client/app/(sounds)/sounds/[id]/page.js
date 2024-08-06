import getSound from '@/lib/request/sounds/getSound';
import { redirect } from 'next/navigation';
import Content from '@/app/(sounds)/sounds/[id]/content';
import getSoundMetadata from '@/lib/request/sounds/getSoundMetadata';

export async function generateMetadata({ params }) {
  const sound = await getSoundMetadata(params.id).catch(error => error);
  if (typeof sound === 'string') return;

  return {
    title: `Sound ${sound.name}`,
    keywords: [
      sound.name,
      `discord sound ${sound.name}`,
      `discord soundboard ${sound.name}`,
      `discord ${sound.name} download`,
      `discord ${sound.name} upload`,
      `${sound.name} download`
    ],
    openGraph: {
      title: `Discord Place - Sound ${sound.name}`
    }
  };
}

export default async function Page({ params }) {
  const sound = await getSound(params.id).catch(error => error);
  if (typeof sound === 'string') return redirect(`/error?message=${encodeURIComponent(sound)}`);
  
  return <Content sound={sound} />;
}