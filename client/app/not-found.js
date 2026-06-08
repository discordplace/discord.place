'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';

export default function Error() {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='relative z-0 flex h-svh w-full flex-col items-center justify-center px-8 sm:px-0'>
      <div className='flex flex-col'>
        <h2 className='text-3xl font-semibold'>
          You lost in the void, didn{'\''}t you?
        </h2>

        <p className='mt-6 max-h-[200px] w-full max-w-[500px] text-base font-light text-tertiary'>
          The place you are looking for doesn{'\''}t exist. Or maybe it does, but it{'\''}s hidden somewhere in the void. Either way, it{'\''}s not here.
        </p>

        <div className='mt-6 flex w-full items-center justify-between'>
          <Link
            className='pointer-events-auto w-max rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            href='/'
          >
            Go Home
          </Link>

          <Image
            src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'}
            width={64}
            height={64}
            alt='discord.place Logo'
            className='size-[24px]'
          />
        </div>
      </div>
    </div>
  );
}