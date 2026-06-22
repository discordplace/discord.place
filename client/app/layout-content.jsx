'use client';

import { Toaster } from 'sonner';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ThemeProvider from '@/app/components/Providers/Theme';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import CookieBanner from '@/app/components/CookieBanner';
import { Suspense } from 'react';
import ModalProvider from '@/app/components/Providers/Modal';
import useGeneralStore from '@/stores/general';
import FullPageLoading from './components/FullPageLoading';
import ReportButtonProvider from '@/app/components/Providers/ReportButton';
import { motion, AnimatePresence } from 'framer-motion';

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