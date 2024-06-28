'use client';

import cn from '@/lib/cn';
import Image from 'next/image';

export default function ServerIcon({ width, height, className, icon_url, name }) {

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
    icon_url ? (
      <Image
        src={icon_url}
        alt={`${name} guild icon`}
        width={width}
        height={height}
        className={cn(
          'rounded-lg',
          className
        )}
        style={{ 
          width: `${width}px`, 
          height: `${height}px` 
        }}
      />
    ) : (
      <div 
        className={cn(
          'select-none bg-quaternary rounded-lg flex items-center justify-center',
          className
        )} 
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        <h2 className='text-3xl font-bold'>
          {getCompressedName(name)}
        </h2>
      </div>
    )
  );
}