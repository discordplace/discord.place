'use client';

import { useState } from 'react';

import MotionImage from '@/app/components/Motion/Image';
import cn from '@/lib/cn';
import getHashes from '@/lib/request/general/getHashes';

const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAK6wAACusBgosNWgAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAPSURBVHicY2QAAsbBSwAACvAAIQlaz/gAAAAASUVORK5CYII=';
const FALLBACK_AVATAR_SRC = '/default-discord-avatar.png';

function getDefaultAvatarSrc(id) {
  try {
    const index = Number((BigInt(id) >> 22n) % 6n);

    return `/default-avatars/${index}.png`;
  } catch {
    return FALLBACK_AVATAR_SRC;
  }
}

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
      if (newHash) freshAvatarValues.set(id, { at: Date.now(), hash: newHash });
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
    return { format, hash, src: hash ? getUrl(id, hash, format) : getDefaultAvatarSrc(id) };
  }

  function resolveInitial(id, hash) {
    if (!hash) return buildEntry(null);

    const memo = getCachedHash(id);
    if (memo) {
      if (isRecentlyDead(id, memo.hash, memo.format)) return { ...buildEntry(memo.hash, memo.format), src: getDefaultAvatarSrc(id) };

      return buildEntry(memo.hash, memo.format);
    }

    if (isRecentlyDead(id, hash)) return { ...buildEntry(hash), src: getDefaultAvatarSrc(id) };

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
    if (!current.hash) {
      setCurrent({ ...current, src: getDefaultAvatarSrc(id) });

      return;
    }

    if (healAttempted) {
      markDead(current);
      setCurrent({ format: undefined, hash: null, src: getDefaultAvatarSrc(id) });

      return;
    }

    setHealAttempted(true);
    setCurrent({ ...current, src: DEFAULT_AVATAR_BASE64 });

    const newHash = await getFreshAvatarHash(id);
    const newSrc = newHash ? getUrl(id, newHash) : null;

    if (newSrc && newSrc !== current.src) {
      setCurrent({ format: undefined, hash: newHash, src: newSrc });

      return;
    }

    if (current.hash?.startsWith('a_') && current.format !== 'webp') {
      freshAvatarValues.set(id, { at: Date.now(), format: 'webp', hash: current.hash });
      setCurrent({ format: 'webp', hash: current.hash, src: getUrl(id, current.hash, 'webp') });

      return;
    }

    markDead(current);
    setCurrent({ format: undefined, hash: null, src: getDefaultAvatarSrc(id) });
  }

  const isSmallImage = (props.width && props.width < 40) || (props.height && props.height < 40);

  if (!hash || !current.src) {
    return (
      <MotionImage
        key={`user-avatar-${id}-default-avatar`}
        src={getDefaultAvatarSrc(id)}
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
