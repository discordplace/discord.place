import { notFound, redirect } from 'next/navigation';

import Content from '@/app/(profiles)/profile/u/[user_id]/content';
import createMetadata from '@/lib/createMetadata';
import isSnowflake from '@/lib/isSnowflake';
import getUser from '@/lib/request/general/getUser';

export async function generateMetadata({ params }) {
  const { user_id } = await params;

  if (!isSnowflake(user_id)) notFound();

  return createMetadata({
    title: `User ${user_id}`
  });
}

export default async function Page({ params }) {
  const { user_id } = await params;

  if (!isSnowflake(user_id)) notFound();

  const user = await getUser(user_id).catch(error => error);
  if (typeof user === 'string') return redirect(`/error?message=${encodeURIComponent(user)}`);

  return <Content user={user} />;
}