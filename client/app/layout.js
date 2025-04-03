import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';
import { GeistSans } from 'geist/font/sans';
import cn from '@/lib/cn';
import LayoutContent from '@/app/layout-content';
import AuthProvider from '@/app/components/Providers/Auth';
import localFont from 'next/font/local';

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

const GGSans = localFont({
  src: [
    {
      path: '../public/fonts/GG-Sans-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/GG-Sans-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/GG-Sans-Normal.ttf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-gg-sans',
  display: 'swap'
});

export default function RootLayout(props) {
  return (
    <html lang='en' translate='no' className='dark'>
      <body
        className={cn(
          'flex flex-col',
          GeistSans.className,
          GeistSans.variable,
          GGSans.variable
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