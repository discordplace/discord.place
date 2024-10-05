import Hero from '@/app/(profiles)/profiles/components/Hero';
import Profiles from '@/app/(profiles)/profiles/components/Hero/Profiles';

export const metadata = {
  title: 'Profiles',
  description: 'Find, share and explore the customized page of Discord profiles!',
  openGraph: {
    title: 'Discord Place - Profiles',
    description: 'Find, share and explore the customized page of Discord profiles!',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place/profiles',
    site_name: 'Discord Place',
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        alt: 'Discord Place'
      }
    ]
  }
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