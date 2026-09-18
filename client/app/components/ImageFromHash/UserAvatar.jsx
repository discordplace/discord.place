'use client';

import MotionImage from '@/app/components/Motion/Image';
import getHashes from '@/lib/request/general/getHashes';
import axios from 'axios';
import { useState } from 'react';
import cn from '@/lib/cn';

const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAK6wAACusBgosNWgAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAPSURBVHicY2QAAsbBSwAACvAAIQlaz/gAAAAASUVORK5CYII=';

const HASH_TTL = 5 * 60 * 1000;
const DEAD_TTL = 10 * 60 * 1000;

const freshAvatarRequests = new Map();
const freshAvatarValues = new Map();
const deadAvatarUrls = new Map();

function getCachedHash(id) {
  const entry = freshAvatarValues.get(id);
  if (!entry) return null;
  if (Date.now() - entry.at > HASH_TTL) {
    freshAvatarValues.delete(id);

    return null;
  }

  return entry;
}

function isRecentlyDead(id, hash, format) {
  const at = deadAvatarUrls.get(`${id}:${hash}:${format ?? 'default'}`);
  if (!at) return false;
  if (Date.now() - at > DEAD_TTL) {
    deadAvatarUrls.delete(`${id}:${hash}:${format ?? 'default'}`);

    return false;
  }

  return true;
}

function getFreshAvatarHash(id) {
  const cached = freshAvatarRequests.get(id);
  if (cached) return cached;

  const promise = getHashes(id)
    .then(hashes => {
      const newHash = hashes?.avatar || null;
      if (newHash) freshAvatarValues.set(id, { hash: newHash, at: Date.now() });
      freshAvatarRequests.delete(id);

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
  function getUrl(id, hash, forcedFormat) {
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${forcedFormat || format || (hash?.startsWith('a_') ? 'gif' : 'webp')}?size=${size || 256}`;
  }

  function buildEntry(hash, format) {
    return { src: hash ? getUrl(id, hash, format) : null, hash, format };
  }

  function resolveInitial(id, hash) {
    if (!hash) return buildEntry(null);

    const memo = getCachedHash(id);
    if (memo) {
      if (isRecentlyDead(id, memo.hash, memo.format)) return { ...buildEntry(memo.hash, memo.format), src: DEFAULT_AVATAR_BASE64 };

      return buildEntry(memo.hash, memo.format);
    }

    if (isRecentlyDead(id, hash)) return { ...buildEntry(hash), src: DEFAULT_AVATAR_BASE64 };

    return buildEntry(hash, undefined);
  }

  const [current, setCurrent] = useState(() => resolveInitial(id, hash));
  const [prevHash, setPrevHash] = useState(hash);
  const [healAttempted, setHealAttempted] = useState(false);

  if (prevHash !== hash) {
    setPrevHash(hash);
    setCurrent(buildEntry(hash, undefined));
    setHealAttempted(false);
  }

  function markDead(entry) {
    deadAvatarUrls.set(`${id}:${entry.hash}:${entry.format ?? 'default'}`, Date.now());
  }

  async function handleError() {
    if (current.src === DEFAULT_AVATAR_BASE64) return;

    if (healAttempted) {
      markDead(current);
      setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });

      return;
    }

    setHealAttempted(true);

    try {
      await axios.get(getUrl(id, current.hash, current.format));
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });

        return;
      }
    }

    const newHash = await getFreshAvatarHash(id);
    const newSrc = newHash ? getUrl(id, newHash) : null;

    if (newSrc && newSrc !== current.src) {
      setCurrent({ src: newSrc, hash: newHash, format: undefined });

      return;
    }

    if (current.hash?.startsWith('a_') && current.format !== 'webp') {
      freshAvatarValues.set(id, { hash: current.hash, format: 'webp', at: Date.now() });
      setCurrent({ src: getUrl(id, current.hash, 'webp'), hash: current.hash, format: 'webp' });

      return;
    }

    markDead(current);
    setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });
  }

  const isSmallImage = (props.width && props.width < 40) || (props.height && props.height < 40);

  if (!hash || !current.src) {
    return (
      <MotionImage
        key={`user-avatar-${id}-replaced-with-default-avatar`}
        src={DEFAULT_AVATAR_BASE64}
        alt={alt}
        className={cn(className, 'bg-quinary text-tertiary')}
        {...motionOptions}
        {...props}
      />
    );
  }

  return (
    <MotionImage
      key={`user-avatar-${id}-${current.hash}-${current.format ?? 'default'}`}
      src={current.src}
      alt={alt}
      className={cn(className, current.src === DEFAULT_AVATAR_BASE64 && 'bg-quinary text-tertiary')}
      onError={handleError}
      unoptimized={format === 'gif' || hash?.startsWith('a_')}
      placeholder={isSmallImage ? 'empty' : DEFAULT_AVATAR_BASE64}
      {...motionOptions}
      {...props}
    />
  );
}
