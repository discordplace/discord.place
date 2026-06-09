import Content from '@/app/(account)/account/components/Content';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export const metadata = {
  openGraph: {
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        alt: 'Discord Place'
      }
    ],
    locale: 'en_US',
    site_name: 'Discord Place',
    type: 'website',
    url: 'https://discord.place'
  },
  title: 'Account'
};

export default function Page() {
  return (
    <AuthProtected>
      <Content />
    </AuthProtected>
  );
}