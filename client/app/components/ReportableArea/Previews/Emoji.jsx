import config from '@/config';
import Image from 'next/image';

export default function EmojiPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center gap-x-2'>
        {metadata.emoji_ids?.length > 0 ? (
          <div className='flex max-w-[90px] flex-wrap gap-1'>
            {metadata.emoji_ids.map(packagedEmoji => (
              <Image
                alt={`Emoji ${metadata.name}`}
                className='rounded-md bg-quaternary'
                height={24}
                key={packagedEmoji.id}
                src={config.getEmojiURL(`packages/${metadata.id}/${packagedEmoji.id}`, packagedEmoji.animated)}
                width={24}
              />
            ))}

            {new Array(9 - metadata.emoji_ids.length).fill(0).map((_, index) => (
              <div className='size-6 rounded-md bg-quaternary' key={index} />
            ))}
          </div>
        ) : (
          <Image
            alt={`Emoji ${metadata.name}`}
            className='object-contain'
            height={64}
            src={config.getEmojiURL(metadata.id, metadata.animated)}
            width={64}
          />
        )}

        <div className='flex flex-col gap-y-1'>
          <h2 className='text-sm font-semibold text-secondary'>
            {metadata.name}
          </h2>

          <span className='text-xs font-medium text-tertiary'>
            {metadata.id}
          </span>
        </div>
      </div>
    </div>
  );
}