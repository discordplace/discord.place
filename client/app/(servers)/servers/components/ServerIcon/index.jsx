'use client';

import cn from '@/lib/cn';
import Image from 'next/image';

export default function ServerIcon({ width, height, className, icon_url, name }) {

  function getCompressedName(name) {
    if (name.length <= 3) return name;
    if (name.split(' ').length > 1) return name.split(' ').map(word => word[0]).join('').slice(0, 5);
    return name.slice(0, 3);
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
          'bg-quaternary rounded-lg flex items-center justify-center',
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