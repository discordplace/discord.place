'use client';

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
      <div className="fixed z-[999] bottom-0 flex items-center justify-center w-full py-3 border-t border-t-primary font-medium gap-x-4 text-secondary bg-tertiary h-max">
        This website uses 🍪 cookies to ensure you get the best experience on our website.
        <button 
          className="px-3 py-1 font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white hover:bg-black/70 dark:hover:bg-white/70" 
          onClick={() => setCookieConsent(true)}
        >
          Got it!
        </button>
        <Link href="/legal/cookie-policy" className="transition-colors text-tertiary hover:text-primary">
          Learn more
        </Link>
      </div>
    )
  );
}