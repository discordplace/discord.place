import Content from '@/app/(bots)/bots/[id]/manage/content';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import getBot from '@/lib/request/bots/getBot';
import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getBotMetadata(params.id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    openGraph: {
      title: `Discord Place - Manage ${metadata.username}`
    },
    title: `Manage ${metadata.username}`
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
