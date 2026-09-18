'use client';

import MotionImage from '@/app/components/Motion/Image';
import getHashes from '@/lib/request/general/getHashes';
import axios from 'axios';
import { useState } from 'react';
import cn from '@/lib/cn';

const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAK6wAACusBgosNWgAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAPSURBVHicY2QAAsbBSwAACvAAIQlaz/gAAAAASUVORK5CYII=';

const freshAvatarRequests = new Map();
const freshAvatarValues = new Map();

function getFreshAvatarHash(id) {
  const cached = freshAvatarRequests.get(id);
  if (cached) return cached;

  const promise = getHashes(id)
    .then(hashes => {
      const newHash = hashes?.avatar || null;
      if (newHash) freshAvatarValues.set(id, newHash);
      else freshAvatarRequests.delete(id);

      return newHash;
    })
    .catch(() => {
      freshAvatarRequests.delete(id);

      return null;
    });

  freshAvatarRequests.set(id, promise);

  return promise;
}

export default function UserAvatar({ id, hash, format, size, className, motionOptions, alt = '', ...props }) {
  function getUrl(id, hash) {
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${format || (hash?.startsWith('a_') ? 'gif' : 'webp')}?size=${size || 256}`;
  }

  function resolveInitial(id, hash) {
    const effectiveHash = freshAvatarValues.get(id) ?? hash;

    return { src: effectiveHash ? getUrl(id, effectiveHash) : null, hash: effectiveHash };
  }

  const [current, setCurrent] = useState(() => resolveInitial(id, hash));
  const [prevHash, setPrevHash] = useState(hash);
  const [healAttempted, setHealAttempted] = useState(false);

  if (prevHash !== hash) {
    setPrevHash(hash);
    setCurrent(resolveInitial(id, hash));
    setHealAttempted(false);
  }

  async function handleError() {
    if (current.src === DEFAULT_AVATAR_BASE64) return;

    if (healAttempted) {
      setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });

      return;
    }

    setHealAttempted(true);

    freshAvatarRequests.delete(id);
    freshAvatarValues.delete(id);

    try {
      await axios.get(getUrl(id, current.hash));
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });

        return;
      }
    }

    const newHash = await getFreshAvatarHash(id);
    const newSrc = newHash ? getUrl(id, newHash) : null;

    if (newSrc && newSrc !== current.src) setCurrent({ src: newSrc, hash: newHash });
    else setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });
  }

  const isSmallImage = (props.width && props.width < 40) || (props.height && props.height < 40);

  if (!hash || !current.src) {
    return (
      <MotionImage
        key={`user-avatar-${id}-replaced-with-default-avatar`}
        src={DEFAULT_AVATAR_BASE64}
        alt={alt}
        className={cn('bg-quinary text-tertiary', className)}
        {...motionOptions}
        {...props}
      />
    );
  }

  return (
    <MotionImage
      key={`user-avatar-${id}-${current.hash}`}
      src={current.src}
      alt={alt}
      className={cn(current.src === DEFAULT_AVATAR_BASE64 && 'bg-quinary text-tertiary', className)}
      onError={handleError}
      unoptimized={format === 'gif' || hash?.startsWith('a_')}
      placeholder={isSmallImage ? 'empty' : DEFAULT_AVATAR_BASE64}
      {...motionOptions}
      {...props}
    />
  );
}