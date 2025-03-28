'use client';

import { TiStar, HiSortAscending } from '@/icons';
import config from '@/config';
import cn from '@/lib/cn';
import useLanguageStore, { t } from '@/stores/language';
import useSearchStore from '@/stores/templates/search';
import useThemeStore from '@/stores/theme';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';import Ripples from 'react-ripples';
import getCompressedName from '@/lib/getCompressedName';

export default function Card({ data, className }) {
  const theme = useThemeStore(state => state.theme);
  const sort = useSearchStore(state => state.sort);
  const language = useLanguageStore(state => state.language);

  const [isClicked, setIsClicked] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isClicked) timeoutRef.current = setTimeout(() => setIsClicked(false), 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [isClicked]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div
      className={cn(
        'inline-flex rounded-3xl w-full [&>div]:w-full',
        isClicked && 'pointer-events-none',
        className
      )}
    >
      <Ripples
        color={theme === 'dark' ? '#00000050' : '#ffffff50'}
        during={1000}
      >
        <Link
          className='flex h-max w-full cursor-pointer select-none items-center gap-x-4 rounded-3xl bg-secondary p-3 transition-all hover:opacity-70'
          onClick={() => setIsClicked(true)}
          href={`/templates/${data.id}/preview`}
        >
          <div className='flex size-[100px] min-h-[100px] min-w-[100px] items-center justify-center rounded-2xl bg-quaternary text-3xl font-bold mobile:size-[140px] mobile:min-h-[140px] mobile:min-w-[140px] sm:text-5xl'>
            {getCompressedName(data.name)}
          </div>

          <div className='flex flex-col gap-y-2'>
            <h2 className='mt-2 max-w-[130px] truncate text-lg font-semibold text-primary mobile:max-w-[230px]'>
              {data.name}
            </h2>

            <div className='flex gap-x-1 truncate'>
              {data.categories.map(category => (
                <span className='flex items-center gap-x-1 rounded-md bg-quaternary px-2 py-1 text-xs font-medium text-secondary' key={category}>
                  {config.templateCategoriesIcons[category]}
                  {t(`categories.${category}`)}
                </span>
              ))}
            </div>

            <p className='line-clamp-2 whitespace-pre-wrap break-all text-xs text-tertiary mobile:text-sm'>
              {data.description}
            </p>

            <div className='flex gap-x-1 mobile:gap-x-3'>
              <div className='flex items-center gap-x-1'>
                {sort === 'Popular' && (
                  <>
                    <TiStar className='text-tertiary' />
                    <span className='max-w-[50px] truncate text-xs font-medium text-secondary mobile:max-w-[unset]'>
                      {t('templateCard.uses', { count: formatter.format(data.uses) })}
                    </span>
                  </>
                )}

                {sort === 'Newest' && (
                  <>
                    <HiSortAscending className='text-tertiary' />
                    <span className='text-xs font-medium text-secondary'>
                      {new Date(data.created_at).toLocaleDateString(language, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </>
                )}

                {sort === 'Oldest' && (
                  <>
                    <HiSortAscending className='text-tertiary' />
                    <span className='text-xs font-medium text-secondary'>
                      {new Date(data.created_at).toLocaleDateString(language, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </>
                )}
              </div>

              <span className='max-w-[50px] truncate text-xs font-medium text-tertiary mobile:max-w-[unset]'>
                @{data.user.username}
              </span>
            </div>
          </div>
        </Link>
      </Ripples>
    </div>
  );
}