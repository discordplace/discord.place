'use client';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles
} from '@floating-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaDiscord } from 'react-icons/fa6';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useMedia } from 'react-use';

import Image from '@/app/components/AppImage';
import Drawer from '@/app/components/Drawer';
import ServicesDropdown from '@/app/components/Header/ServicesDropdown';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import useAuthStore from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDashboard = pathname === '/dashboard';
  const isTemplatePreview = pathname.startsWith('/templates/') && pathname.endsWith('/preview');
  const isAccount = pathname === '/account';

  const [, setY] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);

  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const theme = useThemeStore(state => state.theme);
  const smBreakpoint = useMedia('(max-width: 640px)');
  const router = useRouter();

  const { refs, floatingStyles, context: floatingContext } = useFloating({
    middleware: [
      offset(36),
      flip({ padding: 8 }),
      shift({ padding: 8 })
    ],
    onOpenChange: setIsServicesHovered,
    open: isServicesHovered,
    placement: 'bottom',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(floatingContext, {
    enabled: !smBreakpoint && !shouldHide,
    handleClose: safePolygon({
      buffer: 1,
      requireIntent: false
    }),
    mouseOnly: true
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  const { isMounted, styles: transitionStyles } = useTransitionStyles(floatingContext, {
    close: { opacity: 0 },
    duration: 150,
    initial: { opacity: 0 },
    open: { opacity: 1 }
  });

  useEffect(() => {
    if (smBreakpoint || shouldHide) setIsServicesHovered(false);
  }, [smBreakpoint, shouldHide]);

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

  if (isDashboard || isTemplatePreview || isAccount) return null;

  /* oxlint-disable react/refs */
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
            const isServices = link.label === t('header.services');
            const Element = link.href ? Link : 'button';

            return (
              <Element
                key={link.label}
                ref={isServices ? refs.setReference : undefined}
                className='group relative text-sm text-black/85 hover:text-black dark:text-white/85 dark:hover:text-white'
                href={link.href || '#'}
                {...(isServices ? getReferenceProps() : {})}
                aria-haspopup={isServices ? 'true' : undefined}
                aria-expanded={isServices ? isServicesHovered : undefined}
                onClick={event => {
                  if (isServices && smBreakpoint) {
                    event.preventDefault();
                    setIsServicesOpen(!isServicesOpen);
                  }
                }}
              >
                <div className='group relative flex h-[20px] cursor-pointer items-center overflow-clip'>
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
          className='ml-6 flex items-center justify-center gap-x-1.5 rounded-full bg-black px-2 text-sm font-semibold text-white select-none hover:bg-black/60 sm:w-[155.5px] sm:px-4.5 dark:bg-white dark:text-black dark:hover:bg-white/60'
          href={loggedIn ? '/account' : config.getLoginURL(pathname, searchParams)}
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
              <span className='max-sm:hidden'>{t('header.continueWithDiscord')}</span>
              <FaDiscord className='size-5' />
            </>
          )}
        </Link>
      </motion.div>

      {!smBreakpoint && !shouldHide && isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className='z-[9999]'
            style={{
              ...floatingStyles,
              ...transitionStyles,
              pointerEvents: isServicesHovered ? 'auto' : 'none'
            }}
            {...getFloatingProps()}
          >
            <div className='rounded-xl border-2 border-primary bg-secondary p-2 drop-shadow-lg'>
              <ServicesDropdown />
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
  /* oxlint-enable react/refs */
}
