import cn from '@/lib/cn';
import Image from 'next/image';
import { TiStarFullOutline } from 'react-icons/ti';

export default function MockReviewCard({ content, rating, username }) {
  return (
    <div className='relative top-3 flex h-max max-w-[300px] rotate-[10deg] flex-col gap-y-2 rounded-2xl bg-tertiary p-2 mobile:p-4'>
      <div className='flex items-center gap-x-2'>
        <Image
          alt='Avatar'
          className='size-[24px] rounded-full mobile:size-[32px]'
          height={32}
          src={`/dicebear/${username}.jpg`}
          width={32}
        />

        <h3 className='truncate text-sm font-medium mobile:text-base'>
          @{username}
        </h3>

        <div
          className={cn(
            'flex mobile:text-base text-xs items-center font-bold gap-x-1',
            rating === 5 && 'text-yellow-500',
            rating === 4 && 'text-orange-400',
            rating === 3 && 'text-orange-600',
            rating <= 2 && 'text-red-500'
          )}
        >
          <TiStarFullOutline />
          {rating}
        </div>
      </div>

      <p className='line-clamp-3 text-xs text-tertiary mobile:text-sm'>
        {content}
      </p>
    </div>
  );
}