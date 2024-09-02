import config from '@/config';
import Image from 'next/image';

export default function EmojiPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className="flex items-center gap-x-2">
        {metadata.emoji_ids?.length > 0 ? (
          <div className='flex flex-wrap max-w-[90px] gap-1'>
            {metadata.emoji_ids.map(packagedEmoji => (
              <Image
                key={packagedEmoji.id}
                src={config.getEmojiURL(`packages/${metadata.id}/${packagedEmoji.id}`, packagedEmoji.animated)}
                alt={`Emoji ${metadata.name}`}
                width={24}
                height={24}
                className="rounded-md bg-quaternary"
              />
            ))}

            {new Array(9 - metadata.emoji_ids.length).fill(0).map((_, index) => (
              <div key={index} className='w-6 h-6 rounded-md bg-quaternary' />
            ))}
          </div>
        ) : (
          <Image
            src={config.getEmojiURL(metadata.id, metadata.animated)}
            alt={`Emoji ${metadata.name}`}
            width={64}
            height={64}
            className="object-contain"
          />
        )}

        <div className='flex flex-col gap-y-1'>
          <h2 className="text-sm font-semibold text-secondary">
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