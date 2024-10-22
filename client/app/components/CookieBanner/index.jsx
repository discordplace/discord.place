'use client';

import { t } from '@/stores/language';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useLocalStorage('cookieConsent', false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    if (!cookieConsent) setShowCookieBanner(true);
    else setShowCookieBanner(false);
  }, [cookieConsent]);

  return (
    showCookieBanner && (
      <div className='fixed bottom-0 z-[999] flex h-max w-full flex-wrap items-center justify-center gap-4 border-t border-t-primary bg-tertiary py-3 text-center font-medium text-secondary'>
        {t('cookieBanner.text')}
        <button
          className='rounded-lg bg-black px-3 py-1 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
          onClick={() => setCookieConsent(true)}
        >
          {t('cookieBanner.buttons.ok')}
        </button>
        <Link className='text-tertiary transition-colors hover:text-primary' href='/legal/cookie-policy'>
          {t('cookieBanner.buttons.learnMore')}
        </Link>
      </div>
    )
  );
}