import Hero from '@/app/(profiles)/profiles/components/Hero';
import Profiles from '@/app/(profiles)/profiles/components/Hero/Profiles';

export const metadata = {
  description: 'Find, share and explore the customized page of Discord profiles!',
  openGraph: {
    description: 'Find, share and explore the customized page of Discord profiles!',
    images: [
      {
        alt: 'Discord Place',
        height: 540,
        url: '/og.png',
        width: 960
      }
    ],
    locale: 'en_US',
    site_name: 'Discord Place',
    title: 'Discord Place - Profiles',
    type: 'website',
    url: 'https://discord.place/profiles'
  },
  title: 'Profiles'
};

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