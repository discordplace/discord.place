import Content from '@/app/(profiles)/profile/[slug]/edit/content';
import getProfile from '@/lib/request/profiles/getProfile';
import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  const profile = await getProfile(params.slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);
  if (profile.permissions.canEdit === false) return redirect('/error?code=50001');

  // No need to add Auth protection here
  // We checking permissions above
  return <Content profile={profile} />;
}
