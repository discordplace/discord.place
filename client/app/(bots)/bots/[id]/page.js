import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import getBot from '@/lib/request/bots/getBot';
import Content from '@/app/(bots)/bots/[id]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getBotMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    title: `Bot ${metadata.username}`,
    description: metadata.short_description,
    openGraph: {
      title: `Discord Place - ${metadata.username} Bot`,
      description: metadata.short_description,
      url: `${config.baseUrl}/bots/${params.id}`,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'bot', metadata }))}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const bot = await getBot(params.id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);
  
  return <Content bot={bot} />;
}
