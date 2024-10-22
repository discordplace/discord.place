import Header from '@/components/header';
import '@/styles/main.css';
import LayoutContent from '@/components/layout-content';
import localFont from 'next/font/local';
import { Suspense } from 'react';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});

export const metadata = {
  description: 'The official documentation for Discord Place, a platform that provides a variety of tools and services for Discord users, developers, and server owners.',
  keywords: ['discord', 'discord place', 'discord place docs', 'discord place api', 'discord place documentation', 'discord place developers'],
  metadataBase: new URL('https://docs.discord.place'),
  openGraph: {
    description: 'The official documentation for Discord Place, a platform that provides a variety of tools and services for Discord users, developers, and server owners.',
    images: [
      {
        height: 540,
        site_name: 'Discord Place API Documentation',
        url: '/og.png',
        width: 960
      }
    ],
    locale: 'en_US',
    site_name: 'Discord Place API Documentation',
    title: 'Discord Place API Documentation',
    type: 'website',
    url: 'https://docs.discord.place'
  },
  title: {
    default: 'Discord Place API Documentation',
    template: '%s - Discord Place API Documentation'
  }
};

export const viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
  userScalable: false,
  width: 'device-width'
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body className={`overflow-y-scroll ${geistSans.variable} font-geist text-primary antialiased`}>
        <Suspense>
          <Header />
        </Suspense>

        <div className='h-[5px] w-full bg-tertiary' />

        <Suspense>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}