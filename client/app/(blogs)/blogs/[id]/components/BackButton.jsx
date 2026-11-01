'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft } from 'react-icons/lu';

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