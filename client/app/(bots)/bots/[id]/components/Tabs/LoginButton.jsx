'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';

import openLoginWindow from '@/lib/openLoginWindow';

export default function LoginButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <button
      className='mt-4 flex items-center justify-center gap-x-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
      onClick={() => openLoginWindow(pathname, searchParams)}
      type='button'
    >
      <FaDiscord className='size-5' />
      Login with Discord
    </button>
  );
}
