'use client';

import Link from 'next/link';
import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import { FiArrowUpRight } from 'react-icons/fi';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function InfoCard({ index, title, description, button, content }) {
  return (
    <div
      className={cn(
        'flex w-full gap-12 flex-col lg:h-[300px] items-center',
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      )}
    >

      <div className='relative h-[300px] w-full max-w-full sm:max-w-[75%] overflow-hidden lg:w-1/2 border shadow-lg rounded-3xl border-primary bg-secondary'>
        {content}
      </div>

      <div className='flex flex-col max-w-full sm:max-w-[75%] w-full lg:w-1/2 gap-4'>
        <h2
          className={cn(
            'text-3xl font-medium',
            BricolageGrotesque.className
          )}
        >
          {title}
        </h2>

        <p className='text-lg font-light text-balance text-secondary'>
          {description}
        </p>

        {button && (
          <Link
            href={button.href}
            target={button.target || '_blank'}
            className='flex items-center -ml-4 text-tertiary hover:text-primary hover:ml-0 px-4 py-2 mt-2 text-sm hover:font-semibold transition-all ring-offset-2 ring-offset-[rgba(var(--bg-background))] rounded-full hover:ring-2 ring-purple-500 w-max hover:bg-purple-500/20 gap-x-1'
          >
            {button.text}

            <FiArrowUpRight />
          </Link>
        )}
      </div>
    </div>
  );
}