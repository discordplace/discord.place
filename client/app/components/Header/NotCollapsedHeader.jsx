'use client';

import { MdMiscellaneousServices, HiNewspaper, FiChevronDown, BsStars } from '@/icons';
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
      id: 'services',
      icon: MdMiscellaneousServices,
      name: t('header.services')
    },
    {
      id: 'blog',
      icon: HiNewspaper,
      name: t('header.blog'),
      href: '/blogs'
    },
    {
      id: 'premium',
      icon: BsStars,
      name: t('header.premium'),
      href: '/premium'
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
    <div className='absolute left-0 top-0 z-[9998] flex w-full items-center justify-center'>
      <div className='mt-8 flex w-full max-w-5xl items-center justify-between'>
        <div className='flex items-center gap-x-12'>
          <LogoWithText />

          <div className='relative flex gap-x-2' id='headerTabs'>
            {links.map(link => (
              <Link
                key={link.name}
                href={link.href || '#'}
                className='relative flex items-start justify-center'
                onMouseEnter={() => setHoveringHeaderTab(link.name)}
                onMouseLeave={() => {
                  setLastMouseOut(Date.now());
                  setHoveringHeaderTab('');
                }}
              >
                <div
                  className='group relative z-[2] flex cursor-pointer items-center gap-x-2 px-3 py-1 text-sm font-semibold text-tertiary transition-all hover:text-primary'
                  id={`headerTab-${link.name}`}
                >
                  <link.icon />

                  {link.name}

                  {link.id === 'services' && (
                    <FiChevronDown
                      size={14}
                      className={cn(
                        'transition-transform transform',
                        hoveringHeaderTab === link.name && '-rotate-180'
                      )}
                    />
                  )}
                </div>

                {link.id === 'services' && (
                  <div
                    className={cn(
                      'absolute pt-12 pb-4 pl-4 pr-4 z-[1]',
                      hoveringHeaderTab !== link.name && 'pointer-events-none'
                    )}
                  >
                    <div
                      className={cn(
                        'transition-all drop-shadow-lg w-max h-max bg-secondary border-2 relative border-primary p-2 rounded-xl',
                        hoveringHeaderTab === link.name ? 'opacity-100' : 'opacity-0 scale-90 -translate-y-2'
                      )}
                    >
                      <div className='absolute left-0 top-0 flex size-full justify-center'>
                        <div className='size-3 -translate-y-2 rotate-45 rounded-t-[2px] border-l-2 border-t-2 border-primary bg-secondary' />
                      </div>

                      <ServicesDropdown />
                    </div>
                  </div>
                )}
              </Link>
            ))}

            <div
              className={cn(
                'transition-all absolute top-0 left-0 w-full h-full rounded-full z-[-1] bg-tertiary',
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