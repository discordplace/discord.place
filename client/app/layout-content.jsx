'use client';

import { Toaster } from 'sonner';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ThemeProvider from '@/app/components/Providers/Theme';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import CookieBanner from '@/app/components/CookieBanner';
import { Suspense, useEffect } from 'react';
import ModalProvider from '@/app/components/Providers/Modal';
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
      <link rel='manifest' href='/manifest.webmanifest' />

      <ProgressBarProvider>
        <Toaster
          toastOptions={{
            className: 'bg-secondary! shadow-lg! border! border-primary! text-primary!'
          }}
        />

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