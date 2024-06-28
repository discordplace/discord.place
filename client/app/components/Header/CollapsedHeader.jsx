import config from '@/config';
import Link from 'next/link';
import { useLockBodyScroll } from 'react-use';
import UserSide from '@/app/components/Header/UserSide';
import { IoMdMenu } from 'react-icons/io';
import { Suspense, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import LogoWithText from '@/app/components/Logo/WithText';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Drawer from '@/app/components/Drawer';
import { useRouter } from 'next-nprogress-bar';
import { MdOutlineOpenInNew } from 'react-icons/md';
import cn from '@/lib/cn';

export default function CollapsedHeader({ pathname }) {
  const theme = useThemeStore(state => state.theme);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useLockBodyScroll(open);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [open]);

  const [statedPathname, setPathname] = useState(pathname);

  useEffect(() => {
    if (statedPathname === null) return;

    if (statedPathname !== pathname) router.push(statedPathname);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statedPathname]);

  return (
    <header className='pointer-events-none absolute top-0 flex justify-between w-full px-4 sm:px-12 lg:px-28 2xl:px-48 z-[9998] pb-6 [transition-duration:750ms]'>
      <div className='mt-6'>
        <div className='hidden transition-colors mobile:block hover:opacity-60'>
          <LogoWithText />
        </div>

        <Link href='/' className='block pointer-events-auto mobile:hidden'>
          <Image src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} height={64} className='w-[48px] h-[48px]' alt='discord.place Logo' />
        </Link>
      </div>

      <div className='flex items-center mt-6 gap-x-4'>
        <Suspense fallback={<></>}>
          <UserSide />
        </Suspense>

        <button
          className='pointer-events-auto'
          onClick={() => setOpen(!open)}
        >
          <FiX
            className={cn(
              'text-2xl text-tertiary absolute transition-opacity duration-300',
              !open && 'opacity-0'
            )} 
          />
          <IoMdMenu 
            className={cn(
              'text-2xl text-tertiary transition-opacity duration-300',
              open && 'opacity-0'
            )}
          />
        </button>

        <Drawer
          openState={open}
          setOpenState={setOpen}
          state={statedPathname}
          setState={setPathname}
          items={config.headerLinks.map(headerLink => ({
            label: <>
              <div className='flex items-center gap-x-1.5'>
                <headerLink.icon />
                {headerLink.title}

                {pathname !== headerLink.href && (
                  <MdOutlineOpenInNew />
                )}
              </div>
            </>,
            value: headerLink.href
          }))}
        />
      </div>
    </header>
  );
}