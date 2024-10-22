import Content from '@/app/(account)/account/components/Content';
import AuthProtected from '@/app/components/Providers/Auth/Protected';

export const metadata = {
  title: 'Account',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place',
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
    <AuthProtected>
      <Content />
    </AuthProtected>
  );
}