import getProfile from '@/lib/request/profiles/getProfile';
import Content from '@/app/(profiles)/profile/[slug]/content';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const profile = await getProfile(params.slug).catch(error => error);
  if (typeof profile === 'string') return;

  return {
    title: `${profile.slug}'s Profile`,
    openGraph: {
      title: `Discord Place - ${profile.slug}'s Profile`
    }
  };
}

export default async function Page({ params }) {
  const profile = await getProfile(params.slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);
  
  return <Content profile={profile} />;
}
