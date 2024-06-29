import getBot from '@/lib/request/bots/getBot';
import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import Content from '@/app/(bots)/bots/[id]/manage/content';
import { redirect } from 'next/navigation';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export async function generateMetadata({ params }) {
  const bot = await getBotMetadata(params.id).catch(error => error);
  if (typeof bot === 'string') return;

  return {
    title: `Manage ${bot.username}`,
    openGraph: {
      title: `Discord Place - Manage ${bot.username}`
    }
  };
}

export default async function Page({ params }) {
  const bot = await getBot(params.id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);
  if (bot.permissions.canEdit === false) return redirect('/error?code=70001');

  return (
    <AuthProtected>
      <Content bot={bot} />
    </AuthProtected>
  );
}
