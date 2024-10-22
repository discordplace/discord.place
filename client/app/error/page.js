'use client';

import Square from '@/app/components/Background/Square';
import config from '@/config';
import { t } from '@/stores/language';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const customMessage = searchParams.get('message');

  return (
    <div className='relative z-0 flex h-svh w-full flex-col items-center justify-center px-8 sm:px-0'>
      <Square blockColor='rgba(var(--bg-tertiary))' column='5' row='5' transparentEffectDirection='leftRightBottomTop' />

      <span className='rounded-lg bg-red-400/10 px-2 py-1 text-xs font-semibold uppercase text-red-400'>
        {t('errorPage.badge')}
      </span>

      <h1 className='mt-4 text-center text-4xl font-medium text-primary'>
        {t('errorPage.title')}
      </h1>

      <p className='mt-2 max-h-[200px] w-full max-w-[800px] text-center text-base text-tertiary'>
        {customMessage || t(`errorPage.messages.${code || Object.keys(config.errorMessages)[0]}`)}
      </p>
    </div>
  );
}