import Content from '@/app/(account)/account/components/Content';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export const metadata = {
  openGraph: {
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