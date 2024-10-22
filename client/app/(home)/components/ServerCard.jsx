'use client';

import getCompressedName from '@/lib/getCompressedName';
import Image from 'next/image';
import { HiMiniUserGroup } from 'react-icons/hi2';

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'decimal'
});

export default function ServerCard({ data }) {
  return (
    <div className='pointer-events-none flex select-none items-center gap-x-1 rounded-full border border-primary bg-secondary py-1 pl-1 pr-3'>
      {data.icon_url ? (
        <Image
          alt={data.name}
          className='rounded-full'
          height={24}
          src={data.icon_url}
          width={24}
        />
      ) : (
        <div className='flex size-[24px] items-center justify-center rounded-full bg-quaternary text-xs font-semibold'>
          {getCompressedName(data.name, 2)}
        </div>
      )}

      <span className='max-w-[100px] overflow-hidden whitespace-nowrap text-xs  font-medium text-tertiary'>
        {data.name}
      </span>

      <span className='flex items-center gap-x-0.5 text-xs font-semibold'>
        {formatter.format(data.member_count)}
        <HiMiniUserGroup />
      </span>
    </div>
  );
}