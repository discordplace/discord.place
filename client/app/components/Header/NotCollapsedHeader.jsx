'use client';

import cn from '@/lib/cn';
import { Suspense, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ServicesDropdown from '@/app/components/Header/ServicesDropdown';
import UserSide from './UserSide';
import Link from 'next/link';
import useGeneralStore from '@/stores/general';
import LogoWithText from '@/app/components/Logo/WithText';
import { t } from '@/stores/language';
import { MdMiscellaneousServices } from 'react-icons/md';
import { BsStars } from 'react-icons/bs';
import { HiNewspaper } from 'react-icons/hi';

export default function NotCollapsedHeader() {
  const hoveringHeaderTab = useGeneralStore(state => state.header.hoveringHeaderTab);
  const setHoveringHeaderTab = useGeneralStore(state => state.header.setHoveringHeaderTab);
  const lastMouseOut = useGeneralStore(state => state.header.lastMouseOut);
  const setLastMouseOut = useGeneralStore(state => state.header.setLastMouseOut);

  const links = [
    {
      id: 'services',
      icon: MdMiscellaneousServices,
      name: t('header.links.0')
    },
    {
      id: 'blog',
      icon: HiNewspaper,
      name: t('header.links.1'),
      href: '/blogs'
    },
    {
      id: 'premium',
      icon: BsStars,
      name: t('header.links.2'),
      href: '/premium'
    }
  ];

  useEffect(() => {
    if (!hoveringHeaderTab) return;

    const hoveringHeaderTabElement = document.getElementById('hoveringHeaderTab');
    const headerTabElement = document.getElementById(`headerTab-${hoveringHeaderTab}`);
    const headerTabsElement = document.getElementById('headerTabs');

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
    <div className="absolute flex items-center justify-center top-0 left-0 w-full z-[9999]">
      <div className="flex items-center justify-between w-full max-w-5xl mt-8">
        <div className='flex items-center gap-x-12'>
          <Link href='/'>
            <LogoWithText />
          </Link>

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
                  className='relative z-[2] flex items-center px-3 py-1 text-sm font-semibold transition-all cursor-pointer group gap-x-2 text-tertiary hover:text-primary'
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
                      <div className='absolute top-0 left-0 flex justify-center w-full h-full'>
                        <div className='w-3 h-3 rounded-t-[2px] rounded-l-[2px] transform rotate-45 -translate-y-2 border-t-2 border-l-2 border-primary bg-secondary' />
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