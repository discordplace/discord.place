'use client';

import { useAuthStore } from '@/stores/auth';
import { redirect } from 'next/navigation';

export default function Protected({ children }) {
  const user = useAuthStore(state => state.user);
  if (!user) redirect('/error?code=401');

  return children;
}