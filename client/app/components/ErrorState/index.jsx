import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function ErrorState({ title, message }) {
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h2 className={cn(
        'text-xl font-semibold text-center text-primary',
        BricolageGrotesque.className
      )}>
        {title}
      </h2>
      <p className='text-lg text-center text-tertiary'>
        {message}
      </p>
    </div>
  );
}