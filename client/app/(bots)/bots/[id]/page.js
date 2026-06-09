import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import getBot from '@/lib/request/bots/getBot';
import Content from '@/app/(bots)/bots/[id]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getBotMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    description: metadata.short_description,
    openGraph: {
      description: metadata.short_description,
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'bot' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - ${metadata.username} Bot`,
      url: `${config.baseUrl}/bots/${params.id}`
    },
    title: `Bot ${metadata.username}`
  };
}

export default async function Page({ params }) {
  const bot = await getBot(params.id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);

  return <Content bot={bot} />;
}