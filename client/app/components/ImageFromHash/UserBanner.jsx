'use client';

import MotionImage from '@/app/components/Motion/Image';
import getHashes from '@/lib/request/getHashes';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

export default function UserBanner({ id, hash, format, size, className, motionOptions, ...props }) {
  const defaultBannerURL = '/default-discord-banner.png';

  const [currentSource, setCurrentSource] = useState(defaultBannerURL);
  const [isErrorOccurred, setIsErrorOccurred] = useState(false);
  const [hashesRefreshed, setHashesRefreshed] = useLocalStorage('hashesRefreshed', []);

  const defaultOptions = {
    format: hash?.startsWith('a_') ? 'gif' : 'webp',
    size: 512
  };

  const options = {
    ...defaultOptions,
    format: format || defaultOptions.format,
    size: size || defaultOptions.size
  };

  useEffect(() => {
    if (!hash) return;

    async function fetchImage() {
      try {
        const response = await axios.get(`https://cdn.discordapp.com/banners/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`);

        setCurrentSource(response.request.responseURL);
      } catch (error) {
        if (isErrorOccurred) return;

        setIsErrorOccurred(true);

        console.warn(`Failed to fetch banner image for user ${id} with hash ${hash}`, error);

        switch (error.response?.status) {
          case 404:
            // Check if the user has been fetched before
            if (hashesRefreshed.some(({ hash: userHash }) => userHash === hash)) break;

            // Get new hashes
            var hashes = await getHashes(id);
            if (!hashes) break;

            // Update the hashesRefreshed state to include the current user ID if it doesn't already
            // This is to prevent the user from being fetched again if the hashes are refreshed

            var notExpiredHashes = hashesRefreshed.filter(({ expireTime }) => expireTime > Date.now());

            if (!notExpiredHashes.some(({ hash: userHash }) => userHash === hash)) {
              const expireTime = Date.now() + 600000;
              setHashesRefreshed(oldHashesRefreshed => oldHashesRefreshed.concat({ hash, expireTime }));
            }

            if (hashesRefreshed.length > 0) {
              // Remove expired hashes from the hashesRefreshed state
              setHashesRefreshed(oldHashesRefreshed => oldHashesRefreshed.filter(hash => hash.expireTime > Date.now()));
            }

            var newHash = hashes.banner;
            if (!newHash) break;

            // Update the image source with the new hash
            setCurrentSource(`https://cdn.discordapp.com/banners/${id}/${newHash}.${newHash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`);

            break;
          default:
            break;
        }
      }
    }

    fetchImage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash]);

  if (!hash) return (
    <MotionImage
      key={`user-banner-${id}-replaced-with-default-banner`}
      src={defaultBannerURL}
      alt={`Image ${hash}`}
      className={className}
      {...motionOptions}
      {...props}
    />
  );

  return (
    <MotionImage
      key={`user-banner-${id}-${hash}`}
      src={currentSource}
      alt={`Image ${hash}`}
      className={className}
      {...motionOptions}
      {...props}
    />
  );
}