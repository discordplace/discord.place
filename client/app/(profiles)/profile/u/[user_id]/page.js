import getUser from '@/lib/request/general/getUser';
import Content from '@/app/(profiles)/profile/u/[user_id]/content';
import { redirect } from 'next/navigation';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { user_id } = await params;

  return createMetadata({
    title: `User ${user_id}`
  });
}

export default async function Page({ params }) {
  const { user_id } = await params;

  const user = await getUser(user_id).catch(error => error);
  if (typeof user === 'string') return redirect(`/error?message=${encodeURIComponent(user)}`);

  return <Content user={user} />;
}