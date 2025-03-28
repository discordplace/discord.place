'use client';

import { LuChevronLeft } from '@/icons';
import { t } from '@/stores/language';
import Link from 'next/link';
export default function BackButton() {
  return (
    <Link
      href='/blogs'
      className='flex w-max items-center gap-x-2 font-medium text-secondary hover:text-primary'
    >
      <LuChevronLeft />
      {t('buttons.back')}
    </Link>
  );
}