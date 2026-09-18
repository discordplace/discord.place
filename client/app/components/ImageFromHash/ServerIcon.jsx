'use client';

import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';

const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAK6wAACusBgosNWgAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAPSURBVHicY2QAAsbBSwAACvAAIQlaz/gAAAAASUVORK5CYII=';

export default function ServerIcon({ id, hash, format, size, className, motionOptions, ...props }) {
  if (!hash) {return (
    <MotionImage
      key={`server-icon-${id}-replaced-with-default-avatar`}
      src={DEFAULT_AVATAR_BASE64}
      alt={`Image ${hash}`}
      className={cn('bg-quinary text-tertiary', className)}
      {...motionOptions}
      {...props}
    />
  );}

  const isSmallImage = (props.width && props.width < 40) || (props.height && props.height < 40);

  return (
    <MotionImage
      key={`server-icon-${id}-${hash}`}
      src={`https://cdn.discordapp.com/icons/${id}/${hash}.${format || (hash?.startsWith('a_') ? 'gif' : 'webp')}?size=${size || 256}`}
      alt={`Image ${hash}`}
      className={className}
      unoptimized={format === 'gif' || hash?.startsWith('a_')}
      placeholder={isSmallImage ? 'empty' : DEFAULT_AVATAR_BASE64}
      {...motionOptions}
      {...props}
    />
  );
}