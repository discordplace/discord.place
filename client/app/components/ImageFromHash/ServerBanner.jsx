'use client';

import MotionImage from '@/app/components/Motion/Image';
import { useState } from 'react';

export default function ServerBanner({ className, format, hash, id, motionOptions, size, ...props }) {
  const [error, setError] = useState(false);

  if (!id || !hash) return null;

  const defaultOptions = {
    format: hash.startsWith('a_') ? 'gif' : 'webp',
    size: 512
  };

  const options = {
    ...defaultOptions,
    format: format || defaultOptions.format,
    size: size || defaultOptions.size
  };

  return (
    <MotionImage
      alt={`Image ${hash}`}
      className={className}
      onError={async event => {
        if (error) return;

        setError(true);

        const element = event.target;

        // Show a fallback image while new hashes are being fetched
        const fallback = '/discord-logo-banner.png';

        element.src = fallback;
      }}
      src={`https://cdn.discordapp.com/banners/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`}
      {...motionOptions}
      {...props}
    />
  );
}