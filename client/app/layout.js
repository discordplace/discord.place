import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';
import { GeistSans } from 'geist/font/sans';
import cn from '@/lib/cn';
import LayoutContent from '@/app/layout-content';
import AuthProvider from '@/app/components/Providers/Auth';

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
    <html lang="en" translate="no" className='dark'>
      <body className={cn(
        'flex flex-col',
        GeistSans.className,
        GeistSans.variable
      )}>
        <AuthProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}