'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';

export default function VerifiedBadge() {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='select-none sm:px-3 sm:py-0.5 flex sm:bg-black/10 sm:dark:bg-white/20 items-center gap-x-1 border-black rounded-full text-sm font-semibold sm:border-2 dark:border-white'>
      <Image
        src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_verified.svg`}
        width={16}
        height={16}
        alt='Badge Verified'
      />

      <span className='hidden sm:block'>
        Verified Profile
      </span>
    </div>
  );
}