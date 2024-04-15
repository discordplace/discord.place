'use client';

import Image from 'next/image';
import Link from 'next/link';
import cn from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import config from '@/config';
import { usePrevious, useWindowScroll } from 'react-use';
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

  const pathname = usePathname();
  const backgroundRef = useRef(null);

  useEffect(() => {
    const activeLink = document.querySelector('header a[data-active="true"]');
    if (activeLink) {
      const { left, width } = activeLink.getBoundingClientRect();
      const { left: parentLeft } = activeLink.parentElement.getBoundingClientRect();
      const x = left - parentLeft;
      const w = width;

      backgroundRef.current.style.left = `${x}px`;
      backgroundRef.current.style.width = `${w}px`;
      backgroundRef.current.style.opacity = 1;
    } else {
      backgroundRef.current.style.opacity = 0;
    }
  }, [pathname]);

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <header className={cn(
        'fixed top-0 grid mt-6 grid-cols-6 w-full max-w-[1200px] z-[9999] pb-6 transition-all [transition-duration:750ms]',
        scrollDirection === 'down' && '-translate-y-full [transition-timing-function:cubic-bezier(.8,-0.76,.38,1.37)]',
        scrollDirection === 'up' && 'translate-y-0 opacity-100'
      )}>
        <div className='flex gap-x-10'>
          <Link href='/' className='hover:animate-logo-spin'>
            <Image src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} height={64} className='w-[48px] h-[48px]' alt='discord.place Logo' />
          </Link>
        </div>

        <div className='flex items-center justify-center col-span-4'>
          <div className='relative flex items-center py-2 border rounded-2xl gap-x-2 border-[rgba(var(--bg-quaternary))] bg-secondary/50 backdrop-blur-lg'>
            <div className='absolute left-0 h-full rounded-2xl w-0 bg-white z-[5]' ref={backgroundRef} />

            {config.headerLinks.map((link, index) => (
              <Link
                key={index}
                className={cn(
                  'relative z-[10] px-3 py-1 rounded-xl text-base font-medium gap-x-1.5 items-center flex select-none',
                  link.disabled && 'pointer-events-none opacity-50',
                  pathname === link.href && 'text-black pointer-events-none'
                )}
                href={link.href}
                data-active={pathname === link.href}
              >
                <link.icon />
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        
        <UserSide />
      </header>
    </div>
  );
}