'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa6';
import useAuthStore from '@/stores/auth';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { useThemeStore } from '@/stores/theme';
import ServicesDropdown from '@/app/components/Header/ServicesDropdown';
import cn from '@/lib/cn';
import Drawer from '@/app/components/Drawer';
import { MdOutlineOpenInNew } from 'react-icons/md';
import config from '@/config';
import { t } from '@/stores/language';
import { useMedia } from 'react-use';

export default function Header() {
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview');
  const isAccount = pathname === '/account';

  if (isDashboard || isTemplatePreview || isAccount) return null;

  const [, setY] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const theme = useThemeStore(state => state.theme);
  const smBreakpoint = useMedia('(max-width: 640px)');

  const [pathnameState, setPathnameState] = useState(pathname);

  useEffect(() => {
    if (pathnameState === null) return;

    if (pathnameState !== pathname) router.push(pathnameState);
  }, [pathnameState]);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;

      if (scrollY > prevY && scrollY > 50) {
        setShouldHide(true);
        setIsServicesOpen(false);
      } else if (scrollY < prevY) {
        setShouldHide(false);
      } else if (scrollY <= 50) {
        setShouldHide(false);
      }

      setPrevY(scrollY);
      setY(scrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevY]);

  return (
    <div className='fixed top-6 left-0 z-[9999] flex w-full items-center justify-center'>
      <motion.div
        className='flex rounded-full bg-secondary/70 px-1.5 py-2.5 backdrop-blur-lg'
        animate={{
          boxShadow: shouldHide ? '0 8px 16px rgba(0, 0, 0, 0.25)' : '0 4px 8px rgba(0, 0, 0, 0.15)',
          filter: shouldHide ? 'blur(4px)' : 'blur(0px)',
          opacity: 1,
          scale: shouldHide ? 0.9 : 1,
          y: shouldHide ? -85 : 0
        }}
        transition={{
          damping: 20,
          mass: 0.8,
          stiffness: 260,
          type: 'spring'
        }}
      >
        <Link href='/'>
          <Image
            src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
            width={26}
            height={26}
            alt='discord.place Logo'
            className='ml-2 size-[26px]'
            priority={true}
          />
        </Link>

        <div className='ml-6 flex items-center gap-x-6'>
          {[
            { label: t('header.services') },
            { href: '/blogs', label: t('header.blog') },
            { href: '/premium', label: t('header.premium') }
          ].map(link => {
            const Element = link.href ? Link : 'button';

            return (
              <Element
                key={link.label}
                className='group relative cursor-pointer text-sm text-white/85 hover:text-white'
                href={link.href || '#'}
                onClick={event => {
                  if (link.label === t('header.services') && smBreakpoint) {
                    event.preventDefault();
                    setIsServicesOpen(!isServicesOpen);
                  }
                }}
              >
                {link.label === t('header.services') ? (
                  <div
                    className={cn(
                      'pointer-events-none absolute left-12 size-max translate-x-[-50%] pt-12',
                      'sm:group-hover:pointer-events-auto sm:group-hover:[&>div]:opacity-100',
                      isServicesOpen && 'max-sm:pointer-events-none max-sm:[&>div]:opacity-0',
                      shouldHide && 'pointer-events-none! [&>div]:opacity-0!'
                    )}
                  >
                    <div className='rounded-xl border-2 border-primary bg-secondary p-2 opacity-0 drop-shadow-lg transition-all duration-300'>
                      <ServicesDropdown />
                    </div>
                  </div>
                ) : null}

                <div className='group relative flex h-[20px] items-center overflow-clip'>
                  <div className='transition-all duration-300 group-hover:translate-y-[-30px]'>
                    {link.label}
                  </div>

                  <div className='absolute top-0 left-0 translate-y-[30px] transition-all duration-300 group-hover:translate-y-[0px]'>
                    {link.label}
                  </div>
                </div>
              </Element>
            );
          })}
        </div>

        <Drawer
          openState={isServicesOpen}
          setOpenState={setIsServicesOpen}
          state={pathnameState}
          setState={setPathnameState}
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

        <Link
          className='ml-6 flex items-center justify-center gap-x-1.5 rounded-full bg-white px-2 text-sm font-semibold text-black select-none hover:bg-white/60 sm:w-[155.5px] sm:px-4.5'
          href={loggedIn ? '/account' : config.getLoginURL(pathname)}
        >
          {loggedIn ? (
            <>
              <span className='max-sm:hidden'>{t('header.myAccount')}</span>

              <UserAvatar
                id={user.id}
                hash={user.avatar}
                size={20}
                width={20}
                height={20}
                className='rounded-full'
              />
            </>
          ) : (
            <>
              {/* <span className='max-sm:hidden'>Continue with</span>
              <FaDiscord className='size-5' /> */}
              {t('header.continueWithDiscord')}
              <FaDiscord className='size-5' />
            </>
          )}
        </Link>
      </motion.div>
    </div>
  );
}