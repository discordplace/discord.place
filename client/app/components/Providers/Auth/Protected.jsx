'use client';

import { redirect } from 'next/navigation';

import { useAuthStore } from '@/stores/auth';

export default function Protected({ children }) {
  const user = useAuthStore(state => state.user);
  if (!user) redirect('/error?code=401');

  return children;
}