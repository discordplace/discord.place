'use client';

import { useEffect } from 'react';
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user || user === 'loading') return;

    async function waitUntilPlausibleFound() {
      while (!window.plausible) await new Promise(resolve => setTimeout(resolve, 100));

      return window.plausible;
    }

    waitUntilPlausibleFound()
      .then(() => {
        const element = document.getElementById('plausible-analytics-script');

        if (element) {
          element.setAttribute('data-user-id', user.id);
          element.setAttribute('data-user-username', user.username);
        }
      });
  }, [user]);

  return children;
}