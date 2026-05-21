'use client';

import { useEffect, useRef } from 'react';
import useAuthStore from '@/stores/auth';
import getAuthenticatedUser from '@/lib/request/auth/getAuthenticatedUser';
import useLanguageStore from '@/stores/language';
import useGeneralStore from '@/stores/general';
import config from '@/config';

export default function AuthProvider({ children }) {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoggedIn = useAuthStore(state => state.setLoggedIn);
  const setLanguage = useLanguageStore(state => state.setLanguage);
  const setShowFullPageLoading = useGeneralStore(state => state.setShowFullPageLoading);
  const hasIdentified = useRef(false);

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
        const localStorageFound = 'localStorage' in window;

        let language = localStorageFound ? window.localStorage.getItem('language') : null;

        if (!language) {
          const localeHeader = navigator.language || navigator.languages[0];
          const preferredLanguage = availableLanguages.find(lang => localeHeader.startsWith(lang));

          language = preferredLanguage || defaultLanguage;

          if (localStorageFound) window.localStorage.setItem('language', language);
        } else if (!availableLanguages.includes(language)) {
          language = defaultLanguage;
          if (localStorageFound) window.localStorage.removeItem('language');
        }

        setLanguage(language);
        setShowFullPageLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || user === 'loading' || hasIdentified.current) return;

    const identify = () => {
      if (typeof window === 'undefined' || !window.umami?.identify) return false;

      window.umami.identify(user.username, {
        id: user.id
      });

      hasIdentified.current = true;

      return true;
    };

    if (identify()) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;

      if (identify() || attempts >= maxAttempts) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [user]);

  return children;
}