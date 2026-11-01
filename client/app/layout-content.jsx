'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import CookieBanner from '@/app/components/CookieBanner';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import ModalProvider from '@/app/components/Providers/Modal';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import ReportButtonProvider from '@/app/components/Providers/ReportButton';
import ThemeProvider from '@/app/components/Providers/Theme';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import useGeneralStore from '@/stores/general';

import FullPageLoading from './components/FullPageLoading';

export default function RootLayoutContent({ children }) {
  const showFullPageLoading = useGeneralStore(state => state.showFullPageLoading);

  return (
    <AnimatePresence mode='wait'>
      {showFullPageLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key='full-page-loading'
        >
          <FullPageLoading />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key='root-layout-content'
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}