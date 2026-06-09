'use client';

import { useEffect, useRef } from 'react';
import useAuthStore from '@/stores/auth';
import getAuthenticatedUser from '@/lib/request/auth/getAuthenticatedUser';
import useLanguageStore from '@/stores/language';
import useGeneralStore from '@/stores/general';
import config from '@/config';
import { tracker } from '@/lib/openreplay';

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
        const localStorageFound = typeof globalThis.window !== 'undefined' && 'localStorage' in globalThis;

        let language = localStorageFound ? globalThis.localStorage.getItem('language') : null;

        if (!language) {
          const localeHeader = navigator.language || navigator.languages[0];
          const preferredLanguage = availableLanguages.find(lang => localeHeader.startsWith(lang));

          language = preferredLanguage || defaultLanguage;
          if (localStorageFound) globalThis.localStorage.setItem('language', language);
        } else if (!availableLanguages.includes(language)) {
          language = defaultLanguage;
          if (localStorageFound) globalThis.localStorage.removeItem('language');
        }

        setLanguage(language);
        setShowFullPageLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || user === 'loading' || hasIdentified.current) return;

    let attemptCount = 0;
    const maxAttempts = 50;

    function attemptIdentify() {
      const umamiReady = globalThis.umami?.identify && typeof globalThis.umami.identify === 'function';
      const trackerReady = tracker && typeof tracker.setUserID === 'function';

      if (!umamiReady || !trackerReady) {
        attemptCount++;
        if (attemptCount < maxAttempts) {
          setTimeout(attemptIdentify, 100);

          return;
        }
      }

      try {
        if (umamiReady) {
          globalThis.umami.identify(user.username, { id: user.id });
        }

        if (trackerReady) {
          tracker.setUserID(user.id);
          if (typeof tracker.setMetadata === 'function') {
            tracker.setMetadata('username', user.username);
          }
        }

        hasIdentified.current = true;
      } catch (error) {
        console.warn('Failed to identify user:', error);
        hasIdentified.current = true;
      }
    };

    attemptIdentify();
  }, [user]);

  return children;
}