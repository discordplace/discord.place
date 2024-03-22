import cn from '@/lib/cn';
import { Source_Serif_4 } from 'next/font/google';
const SourceSerif4 = Source_Serif_4({ subsets: ['latin'] });

export default function ErrorState({ title, message }) {
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h2 className={cn(
        'text-xl font-semibold text-center text-primary',
        SourceSerif4.className
      )}>
        {title}
      </h2>
      <p className='text-lg text-center text-neutral-400'>
        {message}
      </p>
    </div>
  );
}