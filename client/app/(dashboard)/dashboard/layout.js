import AuthProtected from '@/app/components/Providers/Auth/Protected';

export const metadata = {
  title: 'Dashboard',
  openGraph: {
    title: 'Discord Place - Dashboard'
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