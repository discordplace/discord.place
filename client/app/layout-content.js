'use client';

import { Toaster } from 'sonner';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ThemeProvider from '@/app/components/Providers/Theme';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import ErrorBoundary from '@/app/components/Providers/Boundary/Error';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import Script from 'next/script';
import CookieBanner from '@/app/components/CookieBanner';
import { Suspense, useEffect } from 'react';
import ModalProvider from '@/app/components/Providers/Modal';
import config from '@/config';
import Status from '@/app/components/Providers/Status';
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
      <Script 
        defer={true}
        src={config.analytics.script} 
        data-website-id={config.analytics.websiteId}
        data-domains={config.analytics.domains.join(',')}
      />
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
        <Toaster toastOptions={{
          className:'!bg-secondary !shadow-lg !border !border-primary !text-primary'
        }} />

        <Status />

        <ThemeProvider>
          <VaulWrapperProvider>
            <ModalProvider>
              <Suspense fallback={<></>}>
                <ReportButtonProvider />
              </Suspense>
              
              <Suspense fallback={<></>}>
                <Header />
              </Suspense>

              <ErrorBoundary>
                {children}
              </ErrorBoundary>
      
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