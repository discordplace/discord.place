'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { t } from '@/stores/language';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function Heading() {
  return (
    <div className='px-4 lg:px-0 flex flex-col text-center items-center justify-center w-full max-w-5xl mt-[20rem]'>
      <h1
        className={cn(
          'text-4xl mobile:text-5xl font-medium',
          BricolageGrotesque.className
        )}
      >
        {t('home.title')}
      </h1>

      <p className='max-w-2xl mt-6 text-base font-light text-center sm:text-xl text-secondary'>
        {t('home.subtitle')}
      </p>
    </div>
  );
}