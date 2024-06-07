import MotionImage from '@/app/components/Motion/Image';
import Link from 'next/link';
import { HiDocumentDownload } from 'react-icons/hi';
import config from '@/config';
import cn from '@/lib/cn';
import { LuPackage } from 'react-icons/lu';
import { useState } from 'react';

export default function EmojiCard({ id, name, categories, downloads, emoji_ids, className }) {
  const [containerHovered, setContainerHovered] = useState(false);

  return (
    <div className={cn(
      'flex flex-col w-full min-w-[155px]',
      className
    )}>
      <Link 
        className='group relative p-2 flex items-center justify-center h-[110px] rounded-t-2xl bg-secondary lg:hover:bg-quaternary transition-colors group overflow-clip w-full' 
        href={`/emojis/packages/${id}`}
        onMouseEnter={() => setContainerHovered(true)}
        onMouseLeave={() => setContainerHovered(false)}
      >
        <div className={cn(
          containerHovered ? 'grid grid-cols-3 gap-1' : 'flex gap-2 -space-x-6'
        )}>
          {emoji_ids.slice(0, containerHovered ? 9 : 4).map((packaged_emoji, index) => (
            <>
              <MotionImage 
                key={packaged_emoji.id}
                src={config.getEmojiURL(`packages/${id}/${packaged_emoji.id}`, packaged_emoji.animated)}
                alt={`Emoji package ${name} ${index + 1}. emoji`} 
                className={cn(
                  'transition-all object-contain ease-in-out w-[48px] h-[48px] p-0.5 rounded-3xl bg-quaternary',
                  containerHovered && 'w-[32px] h-[32px] rounded-md'
                )}
                width={containerHovered ? 32 : 64}
                height={containerHovered ? 32 : 64}
                style={{
                  zIndex: containerHovered ? 0 : 4 - index
                }}
              />
            </>
          ))}
          {containerHovered && new Array(9 - emoji_ids.length).fill(0).map((_, index) => (
            <div 
              key={index}
              className='w-[32px] h-[32px] p-0.5 rounded-md bg-secondary'
            />
          ))}
        </div>

        <div className='group-hover:bg-secondary transition-all absolute px-2 text-xs font-semibold uppercase bg-quaternary rounded-full right-2 top-1.5'>
          PACK
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
              {downloads}
            </div>
          </div>
        </div>

        <p className='text-xs font-medium text-tertiary max-w-[100%] truncate'>{categories.join(', ')}</p>
      </div>
    </div>
  );
}