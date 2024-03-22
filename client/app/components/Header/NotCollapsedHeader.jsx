'use client';

import Image from 'next/image';
import Link from 'next/link';
import cn from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import config from '@/config';
import { usePrevious, useWindowScroll, useWindowSize } from 'react-use';
import useThemeStore from '@/stores/theme';
import UserSide from '@/app/components/Header/UserSide';

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

  const { width } = useWindowSize();
  const pathname = usePathname();

  const [activeLinkWidth, setActiveLinkWidth] = useState(null);
  const [activeLinkLeft, setActiveLinkLeft] = useState(null);

  useEffect(() => {
    const activeLink = document.querySelector(`a[data-href="${pathname}"]`);
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      setActiveLinkWidth(rect.width);
      setActiveLinkLeft(rect.left);
    } else {
      setActiveLinkWidth(null);
      setActiveLinkLeft(null);
    }
  }, [pathname, width]);

  return (
    <header className={cn(
      'fixed top-0 flex justify-between w-full px-12 lg:px-24 2xl:px-48 z-[9999] pb-6 transition-all [transition-duration:750ms]',
      scrollDirection === 'down' && '-translate-y-full opacity-0 [transition-timing-function:cubic-bezier(.8,-0.76,.38,1.37)]',
      scrollDirection === 'up' && 'translate-y-0 opacity-100'
    )}>
      <div className='flex mt-6 gap-x-10'>
        <Link href='/' className='hover:animate-logo-spin'>
          <Image src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} height={64} className='w-[48px] h-[48px]' alt='discord.place Logo' />
        </Link>

        <div className='flex items-center gap-x-2'>
          <div 
            className={cn(
              'h-[2px] absolute top-0 left-0 w-0 bg-black dark:bg-white transition-[width,left,opacity,top] duration-500 ease-in-out',
              activeLinkWidth === null ? 'opacity-0 -top-[50px]' : 'opacity-100'
            )}
            style={{
              width: activeLinkWidth,
              left: activeLinkLeft
            }}
          />

          {config.headerLinks.map(link => (
            <Link key={link.href} href={link.href || ''} className={cn(
              'mx-4 my-2 rounded relative flex items-center gap-x-2',
              link.href === pathname ? 'font-medium pointer-events-none' : 'text-secondary hover:text-primary',
              !link.href && 'cursor-not-allowed text-secondary/40 hover:text-secondary/40'
            )} data-href={link.href || ''} target={link.target || '_self'}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <UserSide className='mt-6' />
    </header>
  );
}