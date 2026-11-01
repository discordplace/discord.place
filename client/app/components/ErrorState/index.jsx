import { Bricolage_Grotesque } from 'next/font/google';

import cn from '@/lib/cn';

const BricolageGrotesque = Bricolage_Grotesque({ adjustFontFallback: false, display: 'swap', subsets: ['latin'] });

export default function ErrorState({ title, message }) {
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h2 className={cn(
        'text-center text-xl font-semibold text-primary',
        BricolageGrotesque.className
      )}>
        {title}
      </h2>
      <p className='text-center text-lg text-tertiary'>
        {message}
      </p>
    </div>
  );
}