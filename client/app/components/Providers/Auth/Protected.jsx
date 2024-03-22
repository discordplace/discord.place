'use client';

import FullPageLoading from '@/app/components/FullPageLoading';
import { useAuthStore } from '@/stores/auth';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Protected({ children }) {
  const user = useAuthStore(state => state.user);

  useLayoutEffect(() => {    
    if (process.env.NODE_ENV === 'development') return;
    
    if (user === 'loading') return;
    if (!user) redirect('/error?code=401');
  }, [user]);

  if (process.env.NODE_ENV === 'development') return children;

  if (user === 'loading') return <FullPageLoading />;
  if (user) return children;
  else return <FullPageLoading />;
}