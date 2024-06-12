import getEmoji from '@/lib/request/emojis/getEmoji';
import getEmojiMetadata from '@/lib/request/emojis/getEmojiMetadaa';
import { redirect } from 'next/navigation';
import Content from '@/app/(emojis)/emojis/[id]/content';

export async function generateMetadata({ params }) {
  const emoji = await getEmojiMetadata(params.id).catch(error => error);
  if (typeof emoji === 'string') return;

  return {
    title: `Emoji ${emoji.name}.${emoji.animated ? 'gif' : 'png'}`,
    openGraph: {
      title: `Discord Place - Emoji ${emoji.name}.${emoji.animated ? 'gif' : 'png'}`
    }
  };
}

export default async function Page({ params }) {
  const emoji = await getEmoji(params.id).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);
  
  return <Content emoji={emoji} />;
}