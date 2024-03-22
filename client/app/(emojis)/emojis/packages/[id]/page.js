import getEmoji from '@/lib/request/emojis/getEmoji';
import { redirect } from 'next/navigation';
import Content from '@/app/(emojis)/emojis/packages/[id]/content';

export async function generateMetadata({ params }) {
  const emoji = await getEmoji(params.id, true).catch(error => error);
  if (typeof emoji === 'string') return;

  return {
    title: `Emoji Pack ${emoji.name}`,
    openGraph: {
      title: `Discord Place - Emoji Pack ${emoji.name}`
    }
  };
}

export default async function Page({ params }) {
  const emoji = await getEmoji(params.id, true).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);
  
  return <Content emoji={emoji} />;
}