'use client';

import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import { t } from '@/stores/language';

export default function VerifiedBadge() {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='flex select-none items-center gap-x-1 rounded-full text-sm font-semibold sm:bg-black/10 sm:px-3 sm:py-0.5 sm:dark:bg-white/10'>
      <Image
        src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_verified.svg`}
        width={16}
        height={16}
        alt='Badge Verified'
      />

      <span className='hidden sm:block'>
        {t('editProfilePage.verifiedBadge')}
      </span>
    </div>
  );
}