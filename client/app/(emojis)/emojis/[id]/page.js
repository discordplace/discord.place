import getEmoji from '@/lib/request/emojis/getEmoji';
import getEmojiMetadata from '@/lib/request/emojis/getEmojiMetadata';
import { redirect } from 'next/navigation';
import Content from '@/app/(emojis)/emojis/[id]/content';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getEmojiMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  const keywords = [
    `discord emoji ${metadata.name}`,
    'discord emoji',
    `emoji ${metadata.name}`,
    `discord ${metadata.category} emoji`,
    `emoji ${metadata.category}`
  ];

  if (metadata.animated) keywords.push(`animated discord emoji ${metadata.name}`, `animated emoji ${metadata.name}`);

  return createMetadata({
    description: `View the Discord emoji ${metadata.name}.${metadata.animated ? 'gif' : 'png'} on discord.place.`,
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
    title: `Emoji ${metadata.name}.${metadata.animated ? 'gif' : 'png'}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  const emoji = await getEmoji(id).catch(error => error);
  if (typeof emoji === 'string') return redirect(`/error?message=${encodeURIComponent(emoji)}`);

  return <Content emoji={emoji} />;
}