'use client';
 
import config from '@/config';
import { useSearchParams } from 'next/navigation';
import Square from '@/app/components/Background/Square';
import { t } from '@/stores/language';

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const customMessage = searchParams.get('message');

  return (
    <div className='z-0 relative flex flex-col items-center w-full h-[100svh] justify-center px-8 sm:px-0'>
      <Square column='5' row='5' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-tertiary))' />

      <span className='px-2 py-1 text-xs font-semibold text-red-400 uppercase rounded-lg bg-red-400/10'>
        {t('errorPage.badge')}
      </span>

      <h1 className='mt-4 text-4xl font-medium text-center text-primary'>
        {t('errorPage.title')}
      </h1>

      <p className='text-center mt-2 text-base text-tertiary max-w-[800px] w-full max-h-[200px]'>
        {customMessage || t(`errorPage.messages.${code || Object.keys(config.errorMessages)[0]}`)}
      </p>
    </div>
  );
}