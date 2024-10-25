'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import cn from '@/lib/cn';
import BlockItem from '@/app/(account)/account/components/Content/Sidebar/BlockItem';
import CollapseIcon from '@/app/(account)/account/components/Content/Sidebar/Icons/Collapse';
import { BiSolidChevronRight } from 'react-icons/bi';
import Tooltip from '@/app/components/Tooltip';
import Link from 'next/link';
import { useMedia } from 'react-use';
import useAccountStore from '@/stores/account';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Sidebar({ blocks }) {
  const theme = useThemeStore(state => state.theme);
  const isCollapsed = useAccountStore(state => state.isCollapsed);
  const setIsCollapsed = useAccountStore(state => state.setIsCollapsed);

  const isMobile = useMedia('(max-width: 768px)');

  return (
    <div
      className={cn(
        'flex',
        isCollapsed ? 'min-w-[60px] w-[60px]' : 'min-w-[250px]'
      )}
    >
      <div className='sticky top-0 h-max w-full'>
        <div
          className={cn(
            'flex items-center pt-8 select-none gap-4',
            isCollapsed ? 'flex-col pl-4' : 'pl-8'
          )}
        >
          <Link
            className='flex gap-x-4 hover:opacity-60'
            href='/'
          >
            <Image
              src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
              width={64}
              height={64}
              alt='discord.place Logo'
              className='size-6'
              priority={true}
            />

            <h1
              className={cn(
                'text-lg font-semibold',
                isCollapsed && 'hidden',
                BricolageGrotesque.className
              )}
            >
              Discord Place
            </h1>
          </Link>

          {!isMobile && (
            <Tooltip
              content={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              side='right'
            >
              <span
                className={cn(
                  'cursor-pointer',
                  !isCollapsed && 'ml-auto'
                )}
              >
                {isCollapsed ? (
                  <BiSolidChevronRight
                    className='text-secondary hover:text-tertiary'
                    size={20}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                ) : (
                  <CollapseIcon
                    className='text-secondary hover:text-tertiary'
                    height={20}
                    width={20}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                )}
              </span>
            </Tooltip>
          )}
        </div>

        <div className='mt-8 flex w-full flex-col gap-y-1 pl-4'>
          {blocks.filter(({ tabs }) => !tabs).map(block => (
            <BlockItem
              key={block.id}
              {...block}
            />
          ))}

          {blocks.filter(({ tabs }) => tabs).map(block => (
            <div
              key={block.id}
              className={cn(
                'flex flex-col gap-y-1',
                !isCollapsed && 'mt-3'
              )}
            >
              <span
                className={cn(
                  'pl-4 text-sm font-semibold text-tertiary',
                  isCollapsed && 'hidden'
                )}
              >
                {block.name}
              </span>

              <div
                className={cn(
                  'h-[1px] bg-quaternary w-full',
                  !isCollapsed && 'hidden'
                )}
              />

              <div className='flex flex-col gap-y-1'>
                {block.tabs.map(tab => (
                  <BlockItem
                    key={tab.id}
                    {...tab}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}