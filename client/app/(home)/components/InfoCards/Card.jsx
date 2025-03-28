'use client';

import { FiArrowUpRight } from '@/icons';
import Link from 'next/link';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function InfoCard({ index, title, description, button, content }) {
  return (
    <div
      className={cn(
        'flex w-full gap-12 flex-col lg:h-[300px] items-center',
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >

      <div className='relative h-[300px] w-full max-w-full overflow-hidden rounded-3xl border border-primary bg-secondary shadow-lg sm:max-w-[75%] lg:w-1/2'>
        {content}
      </div>

      <div className='flex w-full max-w-full flex-col gap-4 sm:max-w-[75%] lg:w-1/2'>
        <h2
          className={cn(
            'text-3xl font-medium',
            BricolageGrotesque.className
          )}
        >
          {title}
        </h2>

        <p className='text-balance text-lg font-light text-secondary'>
          {description}
        </p>

        {button && (
          <Link
            href={button.href}
            target={button.target || '_blank'}
            className='-ml-4 mt-2 flex w-max items-center gap-x-1 rounded-full px-4 py-2 text-sm text-tertiary ring-purple-500 ring-offset-2 ring-offset-[rgba(var(--bg-background))] transition-all hover:ml-0 hover:bg-purple-500/20 hover:font-semibold hover:text-primary hover:ring-2'
          >
            {button.text}

            <FiArrowUpRight />
          </Link>
        )}
      </div>
    </div>
  );
}