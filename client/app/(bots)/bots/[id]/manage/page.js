import getBot from '@/lib/request/bots/getBot';
import getBotMetadata from '@/lib/request/bots/getBotMetadata';
import Content from '@/app/(bots)/bots/[id]/manage/content';
import { redirect } from 'next/navigation';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export async function generateMetadata({ params }) {
  const { id } = await params;

  const metadata = await getBotMetadata(id).catch(error => error);
  if (typeof metadata === 'string') return;

  return {
    openGraph: {
      title: `Discord Place - Manage ${metadata.username}`
    },
    title: `Manage ${metadata.username}`
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  const bot = await getBot(id).catch(error => error);
  if (typeof bot === 'string') return redirect(`/error?message=${encodeURIComponent(bot)}`);
  if (bot.permissions.canEdit === false) return redirect('/error?code=70001');

  return (
    <AuthProtected>
      <Content bot={bot} />
    </AuthProtected>
  );
}