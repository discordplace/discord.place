'use client';

import config from '@/config';
import { useSearchParams } from 'next/navigation';
import Square from '@/app/components/Background/Square';

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const customMessage = searchParams.get('message');
  const message = config.errorMessages[String(code)] || config.errorMessages[0];
  
  return (
    <div className='z-0 relative flex flex-col items-center w-full h-[100dvh] justify-center px-8 sm:px-0'>
      <Square column='5' row='5' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-tertiary))' />

      <span className='px-2 py-1 text-xs font-semibold text-red-400 uppercase rounded-lg bg-red-400/10'>
        error
      </span>

      <h1 className='text-center mt-4 text-4xl font-medium text-primary'>
        We{'\''}re sorry, an error occurred.
      </h1>

      <p className='text-center mt-2 text-base text-neutral-400 max-w-[800px] w-full max-h-[200px]'>
        {customMessage || message}
      </p>
    </div>
  );
}