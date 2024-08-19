'use client';

import Link from 'next/link';
import { HiDocumentDownload } from 'react-icons/hi';
import config from '@/config';
import cn from '@/lib/cn';
import { LuPackage } from 'react-icons/lu';
import { t } from '@/stores/language';
import Image from 'next/image';

export default function EmojiPackageCard({ overridedImages, id, name, categories, downloads, emoji_ids, className }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  return (
    <div className={cn(
      'flex flex-col w-full min-w-[155px]',
      className
    )}>
      <Link 
        className='group relative p-2 flex items-center justify-center h-[110px] rounded-t-2xl bg-secondary lg:hover:bg-quaternary transition-colors group overflow-clip w-full' 
        href={`/emojis/packages/${id}`}
      >
        <div className='overflow-hidden w-[150px] h-[90px] rounded-2xl bg-quaternary flex flex-col'>
          <div className='transition-all -rotate-[25deg] relative -top-[1.5rem] grid grid-cols-3 gap-1 place-items-center'>
            {emoji_ids.map((packaged_emoji, index) => (
              <Image
                key={packaged_emoji.id}
                src={overridedImages?.find(({ id }) => id === packaged_emoji.id)?.image || config.getEmojiURL(`packages/${id}/${packaged_emoji.id}`, packaged_emoji.animated)}
                alt={`Emoji package ${name} ${index + 1}. emoji`} 
                className='transition-all object-contain ease-in-out max-w-[48px] w-full h-full max-h-[48px] rounded-xl bg-secondary group-hover:bg-tertiary'
                width={64}
                height={64}
              />
            ))}

            {new Array(9 - emoji_ids.length).fill(0).map((_, index) => (
              <div 
                key={index}
                className='w-[32px] h-[32px] p-0.5 rounded-md bg-secondary'
              />
            ))}
          </div>
        </div>

        <div className='group-hover:bg-secondary transition-all absolute px-2 text-xs font-semibold uppercase bg-quaternary rounded-full right-2 top-1.5'>
          {t('emojiPackageCard.packBadge')}
        </div>
      </Link>

      <div className='flex flex-col px-2 py-2 border-t-2 bg-tertiary rounded-b-2xl border-t-primary'>
        <div className='flex justify-between'>
          <h3 className='text-sm font-semibold text-primary max-w-[75%] truncate'>{name}</h3>
          <div className='flex gap-x-1'>
            <div className='flex items-center text-sm gap-x-0.5 text-tertiary font-medium'>
              <LuPackage />
              {emoji_ids.length}
            </div>
            
            <div className='flex items-center text-sm gap-x-0.5 text-tertiary font-medium'>
              <HiDocumentDownload />
              {formatter.format(downloads)}
            </div>
          </div>
        </div>

        <p className='text-xs font-medium text-tertiary max-w-[100%] truncate'>
          {categories.map(category => t(`categories.${category}`)).join(', ')}
        </p>
      </div>
    </div>
  );
}