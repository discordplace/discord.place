import downloadSound from '@/lib/utils/sounds/downloadSound';

export default function Question1({ sound }) {
  return (
    <div className='flex flex-col mt-2'>
      <p>
        You can use the button below to download <span className='text-primary'>{sound.name}</span> sound.
      </p>
      
      <button
        className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30'
        onClick={() => downloadSound(sound)}
      >
        Download
      </button>
    </div>
  );
}