'use client';

import { LuChevronLeft } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function BackButton() {
  const { t } = useTranslation();

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