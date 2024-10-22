'use client';

import cn from '@/lib/cn';
import Image from 'next/image';

export default function ServerIcon({ className, height, icon_url, name, width }) {

  function getCompressedName(name, limit) {
    const noVowels = name.replace(/[AEIOUaeiou\s]/g, '');

    let compressedName = '';

    for (let i = 0; i < 3; i++) {
      compressedName += noVowels[i];
      if (compressedName.length === limit) break;
    }

    return compressedName;
  }

  return (
    <div>
      {icon_url ? (
        <Image
          alt={`${name} guild icon`}
          className={cn(
            'rounded-lg',
            className
          )}
          height={height}
          src={icon_url}
          style={{
            height: `${height}px`,
            width: `${width}px`
          }}
          width={width}
        />
      ) : (
        <div
          className={cn(
            'select-none bg-quaternary rounded-lg flex items-center justify-center',
            className
          )}
          style={{
            height: `${height}px`,
            width: `${width}px`
          }}
        >
          <h2 className='text-3xl font-bold'>
            {getCompressedName(name)}
          </h2>
        </div>
      )}
    </div>
  );
}