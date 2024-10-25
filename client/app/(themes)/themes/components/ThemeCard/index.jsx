'use client';

import { colord } from 'colord';
import cn from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';

export default function ThemeCard({ id, primaryColor, secondaryColor }) {
  const Container = id ? Link : 'div';

  return (
    <Container
      className={cn(
        'relative pointer-events-none select-none h-[255px] w-[220px] overflow-y-hidden rounded-xl transition-all',
        id && 'hover:border-purple-500 hover:opacity-80 border-2 border-primary'
      )}
      href={`/themes/${id}`}
    >
      <div
        className='absolute left-0 top-0 z-0 size-full'
        style={{
          background: `linear-gradient(${colord(primaryColor).alpha(0.8).toHex()}, ${colord(secondaryColor).alpha(0.8).toHex()})`
        }}
      />

      <Image
        src='/dummy-profile.png'
        alt='Theme Preview'
        width={250}
        height={200}
        className='relative -top-4 h-[440px] w-[220px]'
        priority={true}
      />
    </Container>
  );
}