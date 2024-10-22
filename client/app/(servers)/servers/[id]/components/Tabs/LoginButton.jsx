'use client';

import config from '@/config';
import { t } from '@/stores/language';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa';

export default function LoginButton() {
  const pathname = usePathname();

  return (
    <Link
      className='mt-4 flex items-center justify-center gap-x-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
      href={config.getLoginURL(pathname)}
    >
      <FaDiscord className='size-5' />
      {t('buttons.loginWithDiscord')}
    </Link>
  );
}