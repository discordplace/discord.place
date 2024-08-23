import MotionImage from '@/app/components/Motion/Image';
import getHashes from '@/lib/request/getHashes';

export default function ServerBanner({ id, hash, format, size, className, motionOptions, ...props }) {
  if (!id || !hash) return null;

  const defaultOptions = {
    format: hash.startsWith('a_') ? 'gif' : 'webp',
    size: 512
  };

  const options = {
    ...defaultOptions,
    format,
    size
  };

  return (
    <MotionImage
      src={`https://cdn.discordapp.com/banners/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`}
      alt={`Image ${hash}`}
      className={className}
      onError={async event => {
        const element = event.target;

        // Show a fallback image while new hashes are being fetched
        const fallback = '/discord-logo-banner.png';

        element.src = fallback;
        
        const hashes = await getHashes(id, 'server');
        if (!hashes) return;

        const newHash = hashes.banner;
        if (!newHash) return;

        // Update the image source with the new hash

        element.src = `https://cdn.discordapp.com/banners/${id}/${newHash}.${newHash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`;
      }}
      {...motionOptions}
      {...props}
    />
  );
}