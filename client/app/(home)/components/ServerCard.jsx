'use client';

import { HiMiniUserGroup } from '@/icons';
import getCompressedName from '@/lib/getCompressedName';import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import getHashFromURL from '@/lib/getHashFromURL';
import Link from 'next/link';
import cn from '@/lib/cn';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'compact',
  maximumFractionDigits: 1
});

export default function ServerCard({ data }) {
  const Container = data.is_listed ? Link : 'div';

  return (
    <Container
      className={cn(
        'flex select-none items-center gap-x-1 rounded-full border border-primary bg-secondary py-1 pl-1 pr-3',
        data.is_listed ? 'hover:bg-quaternary transition-colors' : 'pointer-events-none'
      )}
      href={data.is_listed ? `/servers/${data.id}` : ''}
    >
      {data.icon_url ? (
        <ServerIcon
          id={data.id}
          hash={getHashFromURL(data.icon_url, 'icons')}
          size={32}
          className='rounded-full'
          width={24}
          height={24}
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
    </Container>
  );
}