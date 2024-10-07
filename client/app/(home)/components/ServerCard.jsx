'use client';

import Image from 'next/image';
import getCompressedName from '@/lib/getCompressedName';
import { HiMiniUserGroup } from 'react-icons/hi2';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'compact',
  maximumFractionDigits: 1
});

export default function ServerCard({ data }) {
  return (
    <div className='flex items-center py-1 pl-1 pr-3 border rounded-full pointer-events-none select-none border-primary gap-x-1 bg-secondary'>
      {data.icon_url ? (
        <Image
          src={data.icon_url}
          alt={data.name}
          width={24}
          height={24}
          className='rounded-full'
        />
      ) : (
        <div className='w-[24px] h-[24px] rounded-full bg-quaternary text-xs flex items-center justify-center font-semibold'>
          {getCompressedName(data.name, 2)}
        </div>
      )}

      <span className='font-medium text-xs overflow-hidden whitespace-nowrap  text-tertiary max-w-[100px]'>
        {data.name}
      </span>

      <span className='flex items-center gap-x-0.5 text-xs font-semibold'>
        {formatter.format(data.member_count)}
        <HiMiniUserGroup />
      </span>
    </div>
  );
}