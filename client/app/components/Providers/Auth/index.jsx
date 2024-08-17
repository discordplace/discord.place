'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/auth';
import getAuthenticatedUser from '@/lib/request/auth/getAuthenticatedUser';
import useLanguageStore from '@/stores/language';
import useGeneralStore from '@/stores/general';
import config from '@/config';

export default function AuthProvider({ children }) {
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const setLanguage = useLanguageStore(state => state.setLanguage);
  const setShowFullPageLoading = useGeneralStore(state => state.setShowFullPageLoading);

  useEffect(() => {
    getAuthenticatedUser()
      .then(user => {
        setUser(user);
        setLoggedIn(true);
      })
      .catch(() => setUser(null))
      .finally(() => {
        const availableLanguages = config.availableLocales.map(locale => locale.code);
        const defaultLanguage = config.availableLocales.find(locale => locale.default).code;

        if ('localStorage' in window) {
          const language = window.localStorage.getItem('language');
          if (language) {
            if (!availableLanguages.includes(language)) window.localStorage.removeItem('language');
            else setLanguage(language);
          } else setLanguage(defaultLanguage);
        } else setLanguage(defaultLanguage);

        setShowFullPageLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}