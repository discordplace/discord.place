'use client';

import MotionImage from '@/app/components/Motion/Image';
import { useState } from 'react';

export default function ServerIcon({ id, hash, format, size, className, motionOptions, ...props }) {
  const [error, setError] = useState(false);

  if (!id) return null;

  const defaultOptions = {
    format: hash?.startsWith('a_') ? 'gif' : 'webp',
    size: 256
  };

  const options = {
    format: format || defaultOptions.format,
    size: size || defaultOptions.size
  };

  if (!hash) return (
    <MotionImage
      src={'https://cdn.discordapp.com/embed/avatars/0.png'}
      alt={`Image ${hash}`}
      className={className}
      {...motionOptions}
      {...props}
    />
  );

  return (
    <MotionImage
      src={`https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`}
      alt={`Image ${hash}`}
      className={className}
      onError={async event => {
        if (error) return;

        setError(true);

        const element = event.target;

        // Show a fallback image while new hashes are being fetched
        const fallback = 'https://cdn.discordapp.com/embed/avatars/0.png';

        element.src = fallback;
      }}
      {...motionOptions}
      {...props}
    />
  );
}