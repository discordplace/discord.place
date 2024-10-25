'use client';

import MotionImage from '@/app/components/Motion/Image';
import { useState } from 'react';

export default function ServerBanner({ id, hash, format, size, className, motionOptions, ...props }) {
  const defaultAvatarURL = '/default-discord-banner.png';

  const [isErrorOccurred, setIsErrorOccurred] = useState(false);

  const defaultOptions = {
    format: hash?.startsWith('a_') ? 'gif' : 'webp',
    size: 512
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
      {...motionOptions}
      {...props}
    />
  );

  return (
    <MotionImage
      key={`server-banner-${id}-${hash}`}
      src={`https://cdn.discordapp.com/banners/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`}
      alt={`Image ${hash}`}
      className={className}
      onError={event => {
        if (isErrorOccurred) return;

        setIsErrorOccurred(true);

        const fallback = defaultAvatarURL;

        event.target.src = fallback;
      }}
      {...motionOptions}
      {...props}
    />
  );
}