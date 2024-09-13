import Image from 'next/image';
import { TiStarFullOutline } from 'react-icons/ti';
import cn from '@/lib/cn';

export default function MockReviewCard({ username, content, rating }) {
  return (
    <div className='relative top-3 flex flex-col rotate-[10deg] gap-y-2 max-w-[300px] h-max bg-tertiary p-2 mobile:p-4 rounded-2xl'>
      <div className='flex items-center gap-x-2'>
        <Image
          src={`/dicebear/${username}.jpg`}
          alt='Avatar'
          width={32}
          height={32}
          className='w-[24px] h-[24px] mobile:w-[32px] mobile:h-[32px] rounded-full'
        />

        <h3 className='text-sm font-medium truncate mobile:text-base'>
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

      <p className='text-xs mobile:text-sm line-clamp-3 text-tertiary'>
        {content}
      </p>
    </div>
  );
}