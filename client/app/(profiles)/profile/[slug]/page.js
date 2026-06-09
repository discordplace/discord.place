import getProfile from '@/lib/request/profiles/getProfile';
import getProfileMetadata from '@/lib/request/profiles/getProfileMetadata';
import Content from '@/app/(profiles)/profile/[slug]/content';
import { redirect } from 'next/navigation';
import config from '@/config';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const metadata = await getProfileMetadata(slug).catch(error => error);
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
      title: `Discord Place - ${slug}'s Profile`,
      url: `${config.baseUrl}/profile/${slug}`
    },
    title: `${slug}'s Profile`
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const profile = await getProfile(slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);

  return <Content profile={profile} />;
}