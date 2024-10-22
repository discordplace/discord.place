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
      <div className='flex size-full min-h-svh flex-col'>
        {children}
      </div>
    </AuthProtected>
  );
}