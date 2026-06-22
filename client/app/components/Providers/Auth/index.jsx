'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/auth';
import getAuthenticatedUser from '@/lib/request/auth/getAuthenticatedUser';
import useGeneralStore from '@/stores/general';

export default function AuthProvider({ children }) {
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const setShowFullPageLoading = useGeneralStore(state => state.setShowFullPageLoading);

  useEffect(() => {
    getAuthenticatedUser()
      .then(user => {
        setUser(user);
        setLoggedIn(true);
      })
      .catch(() => setUser(null))
      .finally(() => setShowFullPageLoading(false));
  }, []);

  return children;
}