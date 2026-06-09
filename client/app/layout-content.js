'use client';

import { Toaster } from 'sonner';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ThemeProvider from '@/app/components/Providers/Theme';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import OpenReplayProvider from '@/app/components/Providers/OpenReplay';
import Script from 'next/script';
import CookieBanner from '@/app/components/CookieBanner';
import { Suspense, useEffect } from 'react';
import ModalProvider from '@/app/components/Providers/Modal';
import config from '@/config';
import useGeneralStore from '@/stores/general';
import FullPageLoading from './components/FullPageLoading';
import useLanguageStore from '@/stores/language';
import ReportButtonProvider from '@/app/components/Providers/ReportButton';

export default function RootLayoutContent({ children }) {
  const language = useLanguageStore(state => state.language);
  const showFullPageLoading = useGeneralStore(state => state.showFullPageLoading);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', language);
  }, [language]);

  if (showFullPageLoading) return <FullPageLoading />;

  return (
    <section key={language}>
      {process.env.NODE_ENV === 'production' && (
        <>
          <Script
            id='analytics'
            strategy='afterInteractive'
            src={config.analytics.script}
            data-website-id={config.analytics.websiteId}
            data-performance='true'
            data-sample-rate='0.15'
            data-mask-level='moderate'
            data-max-duration='300000'
          />

          <Script
            id='analytics-session-recorder'
            strategy='afterInteractive'
            src={config.analytics.recorderScript}
            data-website-id={config.analytics.websiteId}
            data-sample-rate='0.15'
            data-mask-level='moderate'
            data-max-duration='300000'
          />
        </>
      )}

      <Script id='google-analytics-tag-manager' src='https://www.googletagmanager.com/gtag/js?id=G-WEX8LKYTTD' />
      <Script id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-WEX8LKYTTD');
        `}
      </Script>

      <ProgressBarProvider>
        <Toaster
          toastOptions={{
            className: 'bg-secondary! shadow-lg! border! border-primary! text-primary!'
          }}
        />

        <OpenReplayProvider />

        <ThemeProvider>
          <VaulWrapperProvider>
            <ModalProvider>
              <Suspense fallback={<></>}>
                <ReportButtonProvider />
              </Suspense>

              <Suspense fallback={<></>}>
                <Header />
              </Suspense>

              {children}

              <Suspense fallback={<></>}>
                <Footer />
              </Suspense>

              <CookieBanner />
            </ModalProvider>
          </VaulWrapperProvider>
        </ThemeProvider>
      </ProgressBarProvider>
    </section>
  );
}