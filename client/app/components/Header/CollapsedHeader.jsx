import { MdOutlineOpenInNew, IoMdMenu, FiX } from '@/icons';
import config from '@/config';
import Link from 'next/link';
import { useLockBodyScroll } from 'react-use';
import UserSide from '@/app/components/Header/UserSide';import { Suspense, useEffect, useState } from 'react';import LogoWithText from '@/app/components/Logo/WithText';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Drawer from '@/app/components/Drawer';
import { useRouter } from 'next-nprogress-bar';import cn from '@/lib/cn';
import { t } from '@/stores/language';

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
    <header className='pointer-events-none absolute top-0 z-[9998] flex w-full justify-between px-4 pb-6 [transition-duration:750ms] sm:px-12 lg:px-28 2xl:px-48'>
      <div className='mt-6'>
        <div className='hidden transition-colors hover:opacity-60 mobile:block'>
          <LogoWithText />
        </div>

        <Link href='/' className='pointer-events-auto block mobile:hidden'>
          <Image
            src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
            width={64}
            height={64}
            className='size-[48px]'
            alt='discord.place Logo'
          />
        </Link>
      </div>

      <div className='mt-6 flex items-center gap-x-4'>
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
                {t(`header.${headerLink.id}`)}

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