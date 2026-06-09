'use client';

import { BsStars } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';
import { HiNewspaper } from 'react-icons/hi';
import { MdMiscellaneousServices } from 'react-icons/md';
import cn from '@/lib/cn';
import { Suspense, useEffect } from 'react';
import ServicesDropdown from '@/app/components/Header/ServicesDropdown';
import UserSide from './UserSide';
import Link from 'next/link';
import useGeneralStore from '@/stores/general';
import LogoWithText from '@/app/components/Logo/WithText';
import { t } from '@/stores/language';

export default function NotCollapsedHeader() {
  const hoveringHeaderTab = useGeneralStore(state => state.header.hoveringHeaderTab);
  const setHoveringHeaderTab = useGeneralStore(state => state.header.setHoveringHeaderTab);
  const lastMouseOut = useGeneralStore(state => state.header.lastMouseOut);
  const setLastMouseOut = useGeneralStore(state => state.header.setLastMouseOut);

  const links = [
    {
      icon: MdMiscellaneousServices,
      id: 'services',
      name: t('header.services')
    },
    {
      href: '/blogs',
      icon: HiNewspaper,
      id: 'blog',
      name: t('header.blog')
    },
    {
      href: '/premium',
      icon: BsStars,
      id: 'premium',
      name: t('header.premium')
    }
  ];

  useEffect(() => {
    if (!hoveringHeaderTab) return;

    const hoveringHeaderTabElement = document.getElementById('hoveringHeaderTab');
    const headerTabElement = document.getElementById(`headerTab-${hoveringHeaderTab}`);
    const headerTabsElement = document.getElementById('headerTabs');

    if (!hoveringHeaderTabElement || !headerTabElement || !headerTabsElement) return;

    const headerTabElementRect = headerTabElement.getBoundingClientRect();
    const headerTabsElementRect = headerTabsElement.getBoundingClientRect();

    if (Date.now() - lastMouseOut > 500) {
      hoveringHeaderTabElement.style.transition = 'opacity 150ms, width 0ms, height 0ms, top 0ms, left 0ms';

      setTimeout(() => {
        hoveringHeaderTabElement.style.transition = 'all 150ms';
      }, 150);
    }

    hoveringHeaderTabElement.style.width = `${headerTabElementRect.width}px`;
    hoveringHeaderTabElement.style.height = `${headerTabElementRect.height}px`;

    hoveringHeaderTabElement.style.top = `${headerTabElementRect.top - headerTabsElementRect.top}px`;
    hoveringHeaderTabElement.style.left = `${headerTabElementRect.left - headerTabsElementRect.left}px`;
  }, [hoveringHeaderTab, lastMouseOut]);

  return (
    <div className='absolute top-0 left-0 z-9998 flex w-full items-center justify-center'>
      <div className='mt-8 flex w-full max-w-5xl items-center justify-between'>
        <div className='flex items-center gap-x-12'>
          <LogoWithText />

          <div className='relative flex gap-x-2' id='headerTabs'>
            {links.map(link => {
              const Container = link.href ? Link : 'div';

              return (
                <Container
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative flex items-start justify-center',
                    link.href ? 'cursor-pointer' : 'select-none'
                  )}
                  onMouseEnter={() => setHoveringHeaderTab(link.name)}
                  onMouseLeave={() => {
                    setLastMouseOut(Date.now());
                    setHoveringHeaderTab('');
                  }}
                >
                  <div
                    className='group relative z-2 flex items-center gap-x-2 px-3 py-1 text-sm font-semibold text-tertiary transition-all hover:text-primary'
                    id={`headerTab-${link.name}`}
                  >
                    <link.icon />

                    {link.name}

                    {link.id === 'services' && (
                      <FiChevronDown
                        size={14}
                        className={cn(
                          'transform transition-transform',
                          hoveringHeaderTab === link.name && '-rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {link.id === 'services' && (
                    <div
                      className={cn(
                        'absolute z-1 px-4 pt-12 pb-4',
                        hoveringHeaderTab !== link.name && 'pointer-events-none'
                      )}
                    >
                      <div
                        className={cn(
                          'relative size-max rounded-xl border-2 border-primary bg-secondary p-2 drop-shadow-lg transition-all',
                          hoveringHeaderTab === link.name ? 'opacity-100' : '-translate-y-2 scale-90 opacity-0'
                        )}
                      >
                        <div className='absolute top-0 left-0 flex size-full justify-center'>
                          <div className='size-3 -translate-y-2 rotate-45 rounded-t-[2px] border-t-2 border-l-2 border-primary bg-secondary' />
                        </div>

                        <ServicesDropdown />
                      </div>
                    </div>
                  )}
                </Container>
              );
            })}

            <div
              className={cn(
                'absolute top-0 left-0 z-[-1] size-full rounded-full bg-secondary transition-all',
                hoveringHeaderTab ? 'opacity-100' : 'opacity-0'
              )}
              id='hoveringHeaderTab'
            />
          </div>
        </div>

        <Suspense fallback={<></>}>
          <UserSide />
        </Suspense>
      </div>
    </div>
  );
}