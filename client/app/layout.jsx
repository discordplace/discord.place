import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';

import { Geist, Geist_Mono, Oranienbaum } from 'next/font/google';
import localFont from 'next/font/local';

import AuthProvider from '@/app/components/Providers/Auth';
import I18nProvider from '@/app/components/Providers/I18n';
import LayoutContent from '@/app/layout-content';
import cn from '@/lib/cn';
import createMetadata from '@/lib/createMetadata';
import getLocale from '@/lib/utils/getLocale';

const ggSansFont = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/GG-Sans-Medium.woff2',
      style: 'normal',
      weight: '500'
    },
    {
      path: './fonts/GG-Sans-Bold.woff2',
      style: 'normal',
      weight: '700'
    },
    {
      path: './fonts/GG-Sans-Normal.woff2',
      style: 'normal',
      weight: '400'
    }
  ],
  variable: '--font-gg-sans'
});

const oranienbaumFont = Oranienbaum({
  subsets: ['latin'],
  variable: '--font-oranienbaum',
  weight: ['400']
});

const geistFont = Geist({
  subsets: ['latin'],
  variable: '--font-geist'
});

const geistMonoFont = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
});

export const metadata = createMetadata();

export const viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
  userScalable: false,
  width: 'device-width'
};

export default async function RootLayout(props) {
  const locale = await getLocale();

  return (
    <html
      lang={locale.code}
      translate='no'
      className='dark'
    >
      <body
        className={cn(
          'flex flex-col',
          geistFont.className,
          geistFont.variable,
          geistMonoFont.variable,
          ggSansFont.variable,
          oranienbaumFont.variable
        )}
      >
        <I18nProvider>
          <AuthProvider>
            <LayoutContent>
              {props.children}
            </LayoutContent>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}