'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Heading() {
  return (
    <div className='mt-80 flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center lg:px-0'>
      <h1
        className={cn(
          'text-4xl mobile:text-5xl font-medium',
          BricolageGrotesque.className
        )}
      >
        {t('home.title')}
      </h1>

      <p className='mt-6 max-w-2xl text-center text-base font-light text-secondary sm:text-xl'>
        {t('home.subtitle')}
      </p>
    </div>
  );
}