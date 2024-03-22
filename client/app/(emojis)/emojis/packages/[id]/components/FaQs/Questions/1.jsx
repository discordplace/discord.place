import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';

export default function Question1({ emoji }) {
  return (
    <div className='flex flex-col mt-2'>
      <p>
        You can use the button below to download <span className='text-primary'>{emoji.name}</span> package.
      </p>
      <button className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>
        Download
      </button>
    </div>
  );
}