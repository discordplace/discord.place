import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import getBot from '@/lib/request/bots/getBot';
import Content from '@/app/(bots)/bots/[id]/content';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const bot = await getBotMetadata(params.id).catch(error => error);
  if (typeof bot === 'string') return;

  return {
    title: `Bot ${bot.username}`,
    description: bot.short_description,
    openGraph: {
      title: `Discord Place - ${bot.username} Bot`,
      description: bot.short_description
    }
  };
}

export default async function Page({ params }) {
  const bot = await getBot(params.id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);
  
  return <Content bot={bot} />;
}
