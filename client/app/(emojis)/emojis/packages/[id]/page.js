import Content from '@/app/(emojis)/emojis/packages/[id]/content';
import config from '@/config';
import getEmoji from '@/lib/request/emojis/getEmoji';
import getEmojiMetadata from '@/lib/request/emojis/getEmojiMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getEmojiMetadata(params.id, true).catch(error => error);
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
      title: `Discord Place - Emoji Pack ${metadata.name}`,
      url: `/emojis/packages/${params.id}`
    },
    title: `Emoji Pack ${metadata.name}`
  };
}

export default async function Page({ params }) {
  const emoji = await getEmoji(params.id, true).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);

  return <Content emoji={emoji} />;
}