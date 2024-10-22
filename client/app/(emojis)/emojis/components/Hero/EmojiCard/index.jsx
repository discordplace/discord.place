'use client';

import MotionImage from '@/app/components/Motion/Image';
import Link from 'next/link';
import { HiDocumentDownload } from 'react-icons/hi';
import config from '@/config';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function EmojiCard({ overridedImage, id, name, animated, categories, downloads, className }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div
      className={cn(
        'flex flex-col w-full min-w-[155px]',
        className
      )}
    >
      <Link
        className='group relative flex h-[110px] items-center justify-center text-clip rounded-t-2xl bg-secondary transition-colors lg:hover:bg-quaternary'
        href={`/emojis/${id}`}
      >
        <MotionImage
          src={overridedImage || config.getEmojiURL(id, animated)}
          alt={`${name} emoji`}
          className='size-[50px] transition-all ease-in-out group-hover:size-[86px]'
          width={128}
          height={128}
        />

        {animated && (
          <div className='absolute right-2 top-1.5 rounded-full bg-quaternary px-2 text-xs font-semibold uppercase transition-colors group-hover:bg-secondary'>
            {t('emojiCard.gifBadge')}
          </div>
        )}
      </Link>

      <div className='flex flex-col rounded-b-2xl border-t-2 border-t-primary bg-tertiary p-2'>
        <div className='flex justify-between'>
          <h3 className='max-w-[75%] truncate text-sm font-semibold text-primary'>{name}</h3>

          <div className='flex items-center gap-x-0.5 text-sm font-medium text-tertiary'>
            <HiDocumentDownload />
            {formatter.format(downloads)}
          </div>
        </div>

        <p className='max-w-full truncate text-xs font-medium text-tertiary'>
          {categories.map(category => t(`categories.${category}`)).join(', ')}
        </p>
      </div>
    </div>
  );
}