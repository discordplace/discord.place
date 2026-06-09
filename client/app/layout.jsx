import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';
import { Geist, Geist_Mono, Oranienbaum } from 'next/font/google';
import cn from '@/lib/cn';
import LayoutContent from '@/app/layout-content';
import AuthProvider from '@/app/components/Providers/Auth';
import localFont from 'next/font/local';
import createMetadata from '@/lib/createMetadata';

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

export default function RootLayout(props) {
  return (
    <html lang='en' translate='no' className='dark'>
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
        <AuthProvider>
          <LayoutContent>
            {props.children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}