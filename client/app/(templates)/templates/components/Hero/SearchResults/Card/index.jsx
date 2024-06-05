'use client';

import cn from '@/lib/cn';
import useSearchStore from '@/stores/templates/search';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HiSortAscending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import Ripples from 'react-ripples';

export default function Card({ data }) {
  const theme = useThemeStore(state => state.theme);
  const sort = useSearchStore(state => state.sort);

  function getCompressedName(name, limit) {
    const noVowels = name.replace(/[AEIOUaeiou\s]/g, '');
  
    let compressedName = '';
  
    for (let i = 0; i < 4; i++) {
      compressedName += noVowels[i];
      if (compressedName.length === limit) break;
    }
  
    return compressedName;
  }

  const [isClicked, setIsClicked] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isClicked) timeoutRef.current = setTimeout(() => setIsClicked(false), 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [isClicked]);

  return (
    <div 
      className={cn(
        'inline-flex overflow-hidden rounded-3xl w-full [&>div]:w-full',
        isClicked && 'pointer-events-none'
      )}
    >
      <Ripples
        color={theme === 'dark' ? '#00000050' : '#ffffff50'}
        during={1000}
      >
        <Link
          className="flex items-center w-full p-3 transition-all cursor-pointer select-none hover:opacity-70 gap-x-4 bg-secondary h-max rounded-3xl"
          onClick={() => setIsClicked(true)}
          href={`/templates/${data.id}/preview`}
        >
          <div className="min-w-[100px] min-h-[100px] w-[100px] h-[100px] mobile:min-w-[140px] mobile:min-h-[140px] mobile:w-[140px] mobile:h-[140px] rounded-2xl font-bold bg-quaternary flex items-center justify-center text-3xl sm:text-5xl">
            {getCompressedName(data.name)}
          </div>

          <div className="flex flex-col gap-y-2">
            <h2 className="mt-2 text-lg font-semibold truncate max-w-[230px] text-primary">
              {data.name}
            </h2>
    
            <div className="flex truncate gap-x-1">
              {data.categories.map(category => (
                <span className="px-2 py-1 text-xs font-medium rounded-md text-secondary bg-quaternary" key={category}>
                  {category}
                </span>
              ))}
            </div>

            <p className="text-sm break-all whitespace-pre-wrap text-tertiary line-clamp-2 min-h-[40px]">
              {data.description}
            </p>

            <div className='flex gap-x-3'>
              <div className='flex items-center gap-x-1'>
                {sort === 'Popular' && (
                  <>
                    <TiStar className='text-tertiary' />
                    <span className='text-xs font-medium text-secondary'>
                      {data.uses} uses
                    </span>
                  </>
                )}

                {sort === 'Newest' && (
                  <>
                    <HiSortAscending className='text-tertiary' />
                    <span className='text-xs font-medium text-secondary'>
                      {new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </>
                )}

                {sort === 'Oldest' && (
                  <>
                    <HiSortAscending className='text-tertiary' />
                    <span className='text-xs font-medium text-secondary'>
                      {new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </>
                )}
              </div>

              <div className='flex items-center gap-x-1'>
                <Image
                  src={data.user.avatar_url}
                  alt={`${data.user.username}'s avatar`}
                  width={16}
                  height={16}
                  className='rounded-full'
                />

                <span className='text-xs font-medium text-tertiary'>
                  {data.user.username}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Ripples>
    </div>
  );
}