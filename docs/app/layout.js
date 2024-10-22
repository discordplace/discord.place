import localFont from 'next/font/local';
import '@/styles/main.css';
import { Suspense } from 'react';
import Header from '@/components/header';
import LayoutContent from '@/components/layout-content';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});

export const metadata = {
  metadataBase: new URL('https://docs.discord.place'),
  title: {
    template: '%s - Discord Place API Documentation',
    default: 'Discord Place API Documentation'
  },
  keywords: ['discord', 'discord place', 'discord place docs', 'discord place api', 'discord place documentation', 'discord place developers'],
  description: 'The official documentation for Discord Place, a platform that provides a variety of tools and services for Discord users, developers, and server owners.',
  openGraph: {
    title: 'Discord Place API Documentation',
    description: 'The official documentation for Discord Place, a platform that provides a variety of tools and services for Discord users, developers, and server owners.',
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.discord.place',
    site_name: 'Discord Place API Documentation',
    images: [
      {
        url: '/og.png',
        width: 960,
        height: 540,
        site_name: 'Discord Place API Documentation'
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
    <html lang="en" suppressHydrationWarning={true}>
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