'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useThemeStore } from '@/stores/theme';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function WithText({ className}) {
  const theme = useThemeStore(state => state.theme);

  return (
    <Link className={cn(
      'flex items-center select-none gap-x-6 w-max',
      className
    )} href='/'>
      <Image 
        src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} 
        width={128} 
        height={128} 
        alt="discord.place Logo" 
        className='w-[48px] h-[48px]'
      />

      <div className={cn(
        'flex flex-col',
        BricolageGrotesque.className
      )}>
        <h1 className='text-xl font-bold'>
          Discord
        </h1>
        <h2 className='text-sm font-medium'>
          Place
        </h2>
      </div>
    </Link>
  );
}