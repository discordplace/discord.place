export const metadata = {
  title: 'Redeem',
  openGraph: {
    title: 'Discord Place - Redeem'
  }
};

export default function Layout({ children }) {
  return (
    <div className='flex w-full h-full min-h-[100dvh] flex-col'>
      {children}
    </div>
  );
}