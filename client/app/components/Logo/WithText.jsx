'use client';

import cn from '@/lib/cn';
import { useThemeStore } from '@/stores/theme';
import { Bricolage_Grotesque } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function WithText({ className }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <Link
      className={cn(
        'flex items-center select-none gap-x-6 w-max',
        className
      )}
      href='/'
    >
      <Image
        alt='discord.place Logo'
        className='size-[32px]'
        height={64}
        src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
        width={64}
      />

      <div
        className={cn(
          'flex flex-col',
          BricolageGrotesque.className
        )}
      >
        <h1 className='text-lg font-bold'>
          Discord
        </h1>
        <h2 className='text-xs font-medium'>
          Place
        </h2>
      </div>
    </Link>
  );
}