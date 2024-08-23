import MotionImage from '@/app/components/Motion/Image';
import getHashes from '@/lib/request/getHashes';

export default function ServerIcon({ id, hash, format, size, className, motionOptions, ...props }) {
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
        console.error('Error loading server icon', event, event.target.src);
        const element = event.target;

        // Show a fallback image while new hashes are being fetched
        const fallback = 'https://cdn.discordapp.com/embed/avatars/0.png';

        element.src = fallback;

        const hashes = await getHashes(id, 'server');
        if (!hashes) return;

        const newHash = hashes.icon;
        if (!newHash) return;

        // Update the image source with the new hash

        element.src = `https://cdn.discordapp.com/icons/${id}/${newHash}.${newHash.startsWith('a_') ? 'gif' : 'png'}?size=${options.size}&format=${options.format}`;
      }}
      {...motionOptions}
      {...props}
    />
  );
}