'use client';

import cn from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClickAway, useLockBodyScroll, useMedia } from 'react-use';
import AnimateHeight from 'react-animate-height';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useGeneralStore } from '@/stores/general';

const HEADER_LINKS = [
  {
    name: 'Home',
    href: '/home'
  },
  {
    name: 'Getting Started',
    href: '/getting-started'
  },
  {
    name: 'Endpoints',
    href: '/endpoints'
  },
  {
    name: 'Webhooks',
    href: '/webhooks'
  }
];

export default function Header() {
  const isMobile = useMedia('(max-width: 640px)', false);
  const pathname = usePathname();

  return (
    <>
      {isMobile ? <CollapsedHeader pathname={pathname} /> : <ExpandedHeader pathname={pathname} />}

      <AnimateHeight
        duration={200}
        easing='ease'
        height={pathname === '/home' ? 'auto' : 0}
      >
        <HomeHeader />
      </AnimateHeight>
    </>
  );
}

function ExpandedHeader({ pathname }) {
  return (
    <header className="px-4 bg-purple-800 lg:px-0">
      <div className='flex mx-auto lg:max-w-3xl'>
        {HEADER_LINKS.map(({ name, href }) => (
          <Link
            className={cn(
              'p-4 text-sm font-medium text-[rgba(var(--dark-text-primary))] first:pl-0 last:pr-0',
              pathname === href ? 'cursor-default' : 'text-[rgba(var(--dark-text-primary))]/60 hover:text-[rgba(var(--dark-text-primary))]/80'
            )}
            key={name}
            href={href}
          >
            {name}
          </Link>
        ))}
      </div>
    </header>
  );
}

function CollapsedHeader({ pathname }) {
  const [isOpen, setIsOpen] = useState(false);

  useLockBodyScroll(isOpen);

  const menuContentRef = useRef(null);

  useClickAway(menuContentRef, () => setIsOpen(false));

  const headings = useGeneralStore(state => state.headings);

  return (
    <>
      <header className="z-10 bg-purple-800">
        <div className='flex justify-between p-4 mx-auto lg:max-w-3xl'>
          <Link href='/home'>
            <Image
              alt='Discord Place Logo'
              height={32}
              src='/logo.png'
              width={32}
            />
          </Link>
        
          <button onClick={() => setIsOpen(true)}>
            <IoMenu size={24} />
          </button>
        </div>
      </header>

      <div
        className={cn(
          'absolute top-0 left-0 transition-opacity z-10 flex justify-end w-full h-full bg-black/50',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div
          className='w-[300px] relative duration-500 transition-transform flex flex-col px-8 pb-8 pt-16 bg-purple-800'
          ref={menuContentRef}
        >
          <div className='absolute top-4 flex justify-between w-full max-w-[calc(100%_-_3rem)]'>
            <Image
              alt='Discord Place Logo'
              height={32}
              src='/logo.png'
              width={32}
            />

            <button onClick={() => setIsOpen(false)}>
              <FiX size={24} />
            </button>
          </div>

          {HEADER_LINKS.map(({ name, href }) => (
            <Link
              className={cn(
                'py-2 text-lg font-medium text-[rgba(var(--dark-text-primary))]',
                pathname === href ? 'cursor-default' : 'text-[rgba(var(--dark-text-primary))]/60 hover:text-[rgba(var(--dark-text-primary))]/80'
              )}
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
            >
              {name}
            </Link>
          ))}

          <div className='flex flex-col mt-4 space-y-2'>
            <h2 className='text-lg font-bold text-[rgba(var(--dark-text-primary))]'>Table of Contents</h2>

            <div className='flex flex-col space-y-1'>
              {headings.map(({ id, name, level }) => (
                level !== 'H1' && (
                  <Link
                    className={cn(
                      'text-[rgba(var(--dark-text-primary))]/60 hover:text-[rgba(var(--dark-text-primary))]/80',
                      pathname === `#${id}` && 'text-[rgba(var(--dark-text-primary))]'
                    )}
                    href={`#${id}`}
                    key={id}
                    onClick={() => setIsOpen(false)}
                  >
                    {name}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomeHeader() {
  return (
    <div className='px-4 bg-purple-900 lg:px-0 text-[rgba(var(--dark-text-primary))]'>
      <div className='flex mx-auto space-x-24 lg:max-w-3xl py-7'>
        <div className='flex flex-col space-y-2'>
          <h1 className='text-3xl font-bold text-[rgba(var(--dark-text-primary))]'>
            Discord Place API Documentation
          </h1>

          <p className='max-w-lg text-[rgba(var(--dark-text-primary))]/90'>
            The official documentation for Discord Place, a platform that provides a variety of tools and services for Discord users, developers, and server owners.
          </p>

          <div className='flex items-center mt-4'>
            <iframe
              src="https://ghbtns.com/github-btn.html?user=discordplace&repo=discord.place&type=star&count=true"
              width="90"
              height="20"
              title="GitHub"
            />

            <Link
              className='flex items-center px-2 text-sm bg-purple-600 py-0.5 hover:bg-purple-500 font-medium rounded-full gap-x-1'
              href='https://invite.discord.place'
              target='_blank'
            >
              <FaDiscord className='mr-1.5' />
              Support Server
            </Link>
          </div>
        </div>

        <div className='items-center justify-center hidden lg:flex'>
          <Link href='https://discord.place'>
            <Image
              alt='Discord Place Logo'
              height={80}
              src='/logo.png'
              width={80}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}