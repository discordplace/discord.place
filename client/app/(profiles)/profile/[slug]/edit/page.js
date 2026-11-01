import { notFound, redirect } from 'next/navigation';

import Content from '@/app/(profiles)/profile/[slug]/edit/content';
import config from '@/config';
import getProfile from '@/lib/request/profiles/getProfile';

export default async function Page({ params }) {
  const { slug } = await params;

  if (!config.validateSlug(slug)) notFound();

  const profile = await getProfile(slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);
  if (profile.permissions.canEdit === false) return redirect('/error?code=50001');

  return <Content profile={profile} />;
}