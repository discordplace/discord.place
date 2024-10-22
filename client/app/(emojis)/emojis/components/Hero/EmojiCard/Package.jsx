'use client';

import config from '@/config';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import Image from 'next/image';
import Link from 'next/link';
import { HiDocumentDownload } from 'react-icons/hi';
import { LuPackage } from 'react-icons/lu';

export default function EmojiPackageCard({ categories, className, downloads, emoji_ids, id, name, overridedImages }) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  return (
    <div
      className={cn(
        'flex flex-col w-full min-w-[155px]',
        className
      )}
    >
      <Link
        className='group relative flex h-[110px] w-full items-center justify-center text-clip rounded-t-2xl bg-secondary p-2 transition-colors lg:hover:bg-quaternary'
        href={`/emojis/packages/${id}`}
      >
        <div className='flex h-[90px] w-[150px] flex-col overflow-hidden rounded-2xl bg-quaternary'>
          <div className='relative -top-6 grid rotate-[-25deg] grid-cols-3 place-items-center gap-1 transition-all'>
            {emoji_ids.map((packaged_emoji, index) => (
              <Image
                alt={`Emoji package ${name} ${index + 1}. emoji`}
                className='size-full max-h-[48px] max-w-[48px] rounded-xl bg-secondary object-contain transition-all ease-in-out group-hover:bg-tertiary'
                height={64}
                key={packaged_emoji.id}
                src={overridedImages?.find(({ id }) => id === packaged_emoji.id)?.image || config.getEmojiURL(`packages/${id}/${packaged_emoji.id}`, packaged_emoji.animated)}
                width={64}
              />
            ))}

            {new Array(9 - emoji_ids.length).fill(0).map((_, index) => (
              <div
                className='size-[48px] rounded-md bg-secondary'
                key={index}
              />
            ))}
          </div>
        </div>

        <div className='absolute right-2 top-1.5 rounded-full bg-quaternary px-2 text-xs font-semibold uppercase transition-all group-hover:bg-secondary'>
          {t('emojiPackageCard.packBadge')}
        </div>
      </Link>

      <div className='flex flex-col rounded-b-2xl border-t-2 border-t-primary bg-tertiary p-2'>
        <div className='flex justify-between'>
          <h3 className='max-w-[75%] truncate text-sm font-semibold text-primary'>{name}</h3>
          <div className='flex gap-x-1'>
            <div className='flex items-center gap-x-0.5 text-sm font-medium text-tertiary'>
              <LuPackage />
              {emoji_ids.length}
            </div>

            <div className='flex items-center gap-x-0.5 text-sm font-medium text-tertiary'>
              <HiDocumentDownload />
              {formatter.format(downloads)}
            </div>
          </div>
        </div>

        <p className='max-w-full truncate text-xs font-medium text-tertiary'>
          {categories.map(category => t(`categories.${category}`)).join(', ')}
        </p>
      </div>
    </div>
  );
}