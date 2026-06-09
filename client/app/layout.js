import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';
import { Geist } from 'next/font/google';
import cn from '@/lib/cn';
import LayoutContent from '@/app/layout-content';
import AuthProvider from '@/app/components/Providers/Auth';
import localFont from 'next/font/local';

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

const geistFont = Geist({
  subsets: ['latin'],
  variable: '--font-geist'
});

export const metadata = {
  description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
  keywords: ['discord', 'discord place', 'discord emojis', 'discord servers', 'discord profiles', 'discord emojis', 'discord bots', 'discord developers'],
  metadataBase: new URL('https://discord.place'),
  openGraph: {
    description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
    images: [
      {
        alt: 'Discord Place',
        height: 540,
        url: '/og.png',
        width: 960
      }
    ],
    locale: 'en_US',
    site_name: 'Discord Place',
    title: 'Discord Place',
    type: 'website',
    url: 'https://discord.place'
  },
  title: {
    default: 'Discord Place',
    template: 'Discord Place - %s'
  }
};

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
          ggSansFont.variable
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