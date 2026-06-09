import Hero from '@/app/(profiles)/profiles/components/Hero';
import Profiles from '@/app/(profiles)/profiles/components/Hero/Profiles';
import createMetadata from '@/lib/createMetadata';

export const metadata = createMetadata({
  description: 'Find, share and explore the customized page of Discord profiles!',
  keywords: [
    'discord profiles',
    'custom discord profiles',
    'customized discord profiles',
    'unique discord profiles',
    'best discord profiles',
    'cool discord profiles',
    'discord profile page',
    'custom discord profile page'
  ],
  title: 'Discover Profiles'
});

export default function Page() {
  return (
    <>
      <Hero />
      <div className='flex items-center justify-center'>
        <Profiles />
      </div>
    </>
  );
}