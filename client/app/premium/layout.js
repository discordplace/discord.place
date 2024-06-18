import AuthProtected from '@/app/components/Providers/Auth/Protected';

export const metadata = {
  title: 'Premium',
  openGraph: {
    title: 'Discord Place - Premium'
  }
};

export default function Layout({ children }) {
  return (
    <AuthProtected>
      <div className='flex w-full h-full min-h-[100dvh] flex-col'>
        {children}
      </div>
    </AuthProtected>
  );
}