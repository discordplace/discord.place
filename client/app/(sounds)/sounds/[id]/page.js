import getSound from '@/lib/request/sounds/getSound';
import { redirect } from 'next/navigation';
import Content from '@/app/(sounds)/sounds/[id]/content';

export async function generateMetadata({ params }) {
  const sound = await getSound(params.id).catch(error => error);
  if (typeof sound === 'string') return;

  return {
    title: `Sound ${sound.name}`,
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