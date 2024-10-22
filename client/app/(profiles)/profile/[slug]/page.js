import getProfile from '@/lib/request/profiles/getProfile';
import getProfileMetadata from '@/lib/request/profiles/getProfileMetadata';
import Content from '@/app/(profiles)/profile/[slug]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const metadata = await getProfileMetadata(params.slug).catch(error => error);
  if (typeof metadata === 'string') return redirect(`/error?message=${encodeURIComponent(metadata)}`);

  return {
    title: `${params.slug}'s Profile`,
    openGraph: {
      title: `Discord Place - ${params.slug}'s Profile`,
      url: `${config.baseUrl}/profile/${params.slug}`,
      images: [
        {
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ type: 'profile', metadata }))}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function Page({ params }) {
  const profile = await getProfile(params.slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);

  return <Content profile={profile} />;
}
