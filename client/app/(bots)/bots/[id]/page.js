import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import getBot from '@/lib/request/bots/getBot';
import Content from '@/app/(bots)/bots/[id]/content';
import { redirect } from 'next/navigation';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getBotMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  return createMetadata({
    description: metadata.short_description,
    keywords: [
      `discord bot ${metadata.username}`,
      'discord bot',
      `bot ${metadata.username}`,
      `discord ${metadata.category} bot`,
      `bot ${metadata.category}`
    ],
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'bot' }))}`,
          width: 1200
        }
      ]
    },
    title: `Bot ${metadata.username}`
  });
}

export default async function Page({ params }) {
  const { id } = await params;

  const bot = await getBot(id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);

  return <Content bot={bot} />;
}