'use client';

import { t } from '@/stores/language';
import Link from 'next/link';
import { LuChevronLeft } from 'react-icons/lu';

export default function BackButton() {
  return (
    <Link
      href='/blogs'
      className='flex items-center font-medium w-max text-secondary hover:text-primary gap-x-2'
    >
      <LuChevronLeft />
      {t('buttons.back')}
    </Link>
  );
}