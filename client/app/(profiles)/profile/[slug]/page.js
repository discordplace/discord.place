import Content from '@/app/(profiles)/profile/[slug]/content';
import config from '@/config';
import getProfile from '@/lib/request/profiles/getProfile';
import getProfileMetadata from '@/lib/request/profiles/getProfileMetadata';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const metadata = await getProfileMetadata(params.slug).catch(error => error);
  if (typeof metadata === 'string') return redirect(`/error?message=${encodeURIComponent(metadata)}`);

  return {
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'profile' }))}`,
          width: 1200
        }
      ],
      title: `Discord Place - ${params.slug}'s Profile`,
      url: `${config.baseUrl}/profile/${params.slug}`
    },
    title: `${params.slug}'s Profile`
  };
}

export default async function Page({ params }) {
  const profile = await getProfile(params.slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);

  return <Content profile={profile} />;
}
