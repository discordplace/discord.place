'use client';

import { t } from '@/stores/language';
import Link from 'next/link';
import { LuChevronLeft } from 'react-icons/lu';

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