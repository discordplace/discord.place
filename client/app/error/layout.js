import { Suspense } from 'react';
import FullPageLoading from '../components/FullPageLoading';

export default function Layout({ children }) {
  return (
    <div className='flex w-full h-full min-h-[100dvh] flex-col'>
      <Suspense fallback={FullPageLoading}>
        {children}
      </Suspense>
    </div>
  );
}