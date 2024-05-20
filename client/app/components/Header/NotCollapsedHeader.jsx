'use client';

import Image from 'next/image';
import Link from 'next/link';
import cn from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import config from '@/config';
import { usePrevious, useWindowScroll } from 'react-use';
import useThemeStore from '@/stores/theme';
import UserSide from '@/app/components/Header/UserSide';
import { motion } from 'framer-motion';

export default function NotCollapsedHeader() {
  const theme = useThemeStore(state => state.theme);
  
  const { y } = useWindowScroll();
  const oldY = usePrevious(y);
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    if (oldY !== null) {
      if (y > oldY) {
        setScrollDirection('down');
      } else if (y < oldY) {
        setScrollDirection('up');
      }
    }
  }, [y, oldY]);

  const pathname = usePathname();

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <header className={cn(
        'fixed top-0 pointer-events-none grid mt-6 grid-cols-6 w-full max-w-[1200px] z-[9999] pb-6 transition-all [transition-duration:750ms]',
        scrollDirection === 'down' && '-translate-y-full [transition-timing-function:cubic-bezier(.8,-0.76,.38,1.37)]',
        scrollDirection === 'up' && 'translate-y-0 opacity-100'
      )}>
        <div className='flex gap-x-10'>
          <Link href='/' className='pointer-events-auto hover:animate-logo-spin'>
            <Image src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} height={64} className='w-[48px] h-[48px]' alt='discord.place Logo' />
          </Link>
        </div>

        <div className='flex items-center justify-center col-span-4'>
          <div className='relative pointer-events-auto flex items-center border rounded-2xl gap-x-2 border-[rgba(var(--bg-quaternary))] bg-secondary/50 backdrop-blur-lg'>
            {config.headerLinks.map((link, index) => (
              <Link
                key={index}
                className={cn(
                  'relative z-[10] py-2.5 px-4 text-base font-semibold gap-x-1.5 items-center flex select-none transition-colors duration-500',
                  link.disabled && 'pointer-events-none opacity-50',
                  pathname === link.href && 'text-white dark:text-black pointer-events-none'
                )}
                href={link.href}
                data-active={pathname === link.href}
              >
                <link.icon />
                {link.title}

                {pathname === link.href && (
                  <motion.div
                    layoutId='headerLinkIndicator'
                    className='absolute -z-[1] bottom-0 left-0 w-full h-full bg-black rounded-full pointer-events-none dark:bg-white'
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
        
        <UserSide className='justify-end' />
      </header>
    </div>
  );
}