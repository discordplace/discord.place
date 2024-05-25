import getUser from '@/lib/request/getUser';
import Content from '@/app/(profiles)/profile/u/[user_id]/content';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const user = await getUser(params.user_id).catch(error => error);
  if (typeof user === 'string') return;

  return {
    title: `User @${user.username}`,
    openGraph: {
      title: `Discord Place - User @${user.username}`
    }
  };
}

export default async function Page({ params }) {
  const user = await getUser(params.user_id).catch(error => error);
  if (typeof user === 'string') return redirect(`/error?message=${encodeURIComponent(user)}`);
  
  return <Content user={user} />;
}