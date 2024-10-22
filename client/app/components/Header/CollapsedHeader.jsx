import Drawer from '@/app/components/Drawer';
import UserSide from '@/app/components/Header/UserSide';
import LogoWithText from '@/app/components/Logo/WithText';
import config from '@/config';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { Suspense, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { IoMdMenu } from 'react-icons/io';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useLockBodyScroll } from 'react-use';

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

        <Link className='pointer-events-auto block mobile:hidden' href='/'>
          <Image alt='discord.place Logo' className='size-[48px]' height={64} src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} />
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
          openState={open}
          setOpenState={setOpen}
          setState={setPathname}
          state={statedPathname}
        />
      </div>
    </header>
  );
}