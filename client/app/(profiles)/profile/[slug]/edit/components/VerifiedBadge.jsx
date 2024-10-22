'use client';

import { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';

export default function VerifiedBadge() {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='flex select-none items-center gap-x-1 rounded-full border-black text-sm font-semibold dark:border-white sm:border-2 sm:bg-black/10 sm:px-3 sm:py-0.5 sm:dark:bg-white/20'>
      <Image
        alt='Badge Verified'
        height={16}
        src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_verified.svg`}
        width={16}
      />

      <span className='hidden sm:block'>
        {t('editProfilePage.verifiedBadge')}
      </span>
    </div>
  );
}