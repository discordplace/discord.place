import { Suspense } from 'react';
import FullPageLoading from '../components/FullPageLoading';

export default function Layout({ children }) {
  return (
    <div className='flex size-full min-h-svh flex-col'>
      <Suspense fallback={FullPageLoading}>
        {children}
      </Suspense>
    </div>
  );
}