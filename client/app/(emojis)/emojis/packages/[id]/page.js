import getEmoji from '@/lib/request/emojis/getEmoji';
import getEmojiMetadata from '@/lib/request/emojis/getEmojiMetadata';
import { redirect } from 'next/navigation';
import Content from '@/app/(emojis)/emojis/packages/[id]/content';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getEmojiMetadata(id, true).catch(error => error);
  if (typeof metadata === 'string') return;

  const keywords = [
    `discord emoji pack ${metadata.name}`,
    'discord emoji pack',
    `emoji pack ${metadata.name}`,
    `discord ${metadata.category} emoji pack`,
    `emoji pack ${metadata.category}`
  ];

  return createMetadata({
    description: `View the Discord emoji pack ${metadata.name} on discord.place.`,
    keywords,
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'emoji' }))}`,
          width: 1200
        }
      ]
    },
    title: `Emoji Pack ${metadata.name}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  const emoji = await getEmoji(id, true).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);

  return <Content emoji={emoji} />;
}