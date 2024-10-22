import Content from '@/app/(emojis)/emojis/[id]/content';
import config from '@/config';
import getEmoji from '@/lib/request/emojis/getEmoji';
import getEmojiMetadata from '@/lib/request/emojis/getEmojiMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getEmojiMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'emoji' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - Emoji ${metadata.name}.${metadata.animated ? 'gif' : 'png'}`,
      url: `/emojis/${params.id}`
    },
    title: `Emoji ${metadata.name}.${metadata.animated ? 'gif' : 'png'}`
  };
}

export default async function Page({ params }) {
  const emoji = await getEmoji(params.id).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);

  return <Content emoji={emoji} />;
}