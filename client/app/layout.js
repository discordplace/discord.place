import '@/styles/main.css';
import 'react-medium-image-zoom/dist/styles.css';
import AuthProvider from '@/app/components/Providers/Auth';
import LayoutContent from '@/app/layout-content';
import cn from '@/lib/cn';
import { GeistSans } from 'geist/font/sans';

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
    <html className='dark' lang='en' translate='no'>
      <body className={cn(
        'flex flex-col',
        GeistSans.className,
        GeistSans.variable
      )}>
        <AuthProvider>
          <LayoutContent>
            {props.children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}