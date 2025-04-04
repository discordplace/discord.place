'use client';

import MotionImage from '@/app/components/Motion/Image';
import { useState } from 'react';

export default function ServerIcon({ id, hash, format, size, className, motionOptions, ...props }) {
  const defaultAvatarURL = '/default-discord-avatar.png';

  const [isErrorOccurred, setIsErrorOccurred] = useState(false);

  const defaultOptions = {
    format: hash?.startsWith('a_') ? 'gif' : 'webp',
    size: 256
  };

  const options = {
    ...defaultOptions,
    format: format || defaultOptions.format,
    size: size || defaultOptions.size
  };

  if (!hash) return (
    <MotionImage
      key={`server-icon-${id}-replaced-with-default-avatar`}
      src={defaultAvatarURL}
      alt={`Image ${hash}`}
      className={className}
      unoptimized={options.format === 'gif'}
      {...motionOptions}
      {...props}
    />
  );

  return (
    <MotionImage
      key={`server-icon-${id}-${hash}`}
      src={`https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`}
      alt={`Image ${hash}`}
      className={className}
      onError={event => {
        if (isErrorOccurred) return;

        setIsErrorOccurred(true);

        const fallback = defaultAvatarURL;

        event.target.src = fallback;
      }}
      unoptimized={options.format === 'gif'}
      {...motionOptions}
      {...props}
    />
  );
}