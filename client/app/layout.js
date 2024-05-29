import { GeistSans } from 'geist/font/sans';
import '@/styles/main.css';
import { Toaster } from 'sonner';
import AuthProvider from '@/app/components/Providers/Auth';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ThemeProvider from '@/app/components/Providers/Theme';
import ProgressBarProvider from '@/app/components/Providers/ProgressBar';
import cn from '@/lib/cn';
import ErrorBoundary from '@/app/components/Providers/Boundary/Error';
import VaulWrapperProvider from '@/app/components/Providers/VaulWrapper';
import Script from 'next/script';
import CookieBanner from '@/app/components/CookieBanner';
import 'react-medium-image-zoom/dist/styles.css';
import { Suspense } from 'react';

export const metadata = {
  metadataBase: new URL('https://discord.place'),
  title: {
    template: 'Discord Place - %s',
    default: 'Discord Place'
  },
  keywords: ['discord', 'discord place', 'discord emojis', 'discord servers', 'discord profiles', 'discord emojis', 'discord bots', 'discord developers'],
  description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
  openGraph: {
    title: 'Discord Place',
    description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
    type: 'website',
    locale: 'en_US',
    url: 'https://discord.place',
    site_name: 'Discord Place',
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        alt: 'Discord Place'
      }
    ]
  }
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body className={cn(
        'flex flex-col',
        GeistSans.className,
        GeistSans.variable
      )}>
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
        
          <ThemeProvider>
            <AuthProvider>
              <VaulWrapperProvider>
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
              </VaulWrapperProvider>
            </AuthProvider>
          </ThemeProvider>
        </ProgressBarProvider>
      </body>
    </html>
  );
}