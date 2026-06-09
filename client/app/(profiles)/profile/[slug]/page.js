import getProfile from '@/lib/request/profiles/getProfile';
import getProfileMetadata from '@/lib/request/profiles/getProfileMetadata';
import Content from '@/app/(profiles)/profile/[slug]/content';
import { redirect } from 'next/navigation';
import config from '@/config';
import createMetadata from '@/lib/createMetadata';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const metadata = await getProfileMetadata(slug).catch(error => error);
  if (typeof metadata === 'string') return redirect(`/error?message=${encodeURIComponent(metadata)}`);

  return createMetadata({
    description: metadata.bio,
    keywords: [
      `discord ${metadata.username}`,
      `discord user ${metadata.username}`,
      `discord profile ${metadata.username}`,
      'discord profile',
      `${metadata.username} profile`,
      `discord ${user_id} profile`
    ],
    openGraph: {
      images: [
        {
          height: 630,
          url: `${config.baseUrl}/api/og?data=${encodeURIComponent(JSON.stringify({ metadata, type: 'profile' }))}`,
          width: 1200
        }
      ]
    },
    title: `${slug}'s Profile`
  });
}

export default async function Page({ params }) {
  const { slug } = await params;

  const profile = await getProfile(slug).catch(error => error);
  if (typeof profile === 'string') return redirect(`/error?message=${encodeURIComponent(profile)}`);

  return <Content profile={profile} />;
}