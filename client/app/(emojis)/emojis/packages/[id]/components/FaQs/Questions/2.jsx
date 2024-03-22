'use client';

import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';

export default function Question2({ emoji }) {
  return (
    <div className='flex flex-col mt-2 gap-y-1'>
      <p>
        I{'\''}m glad to hear that!
      </p>

      <div className='mt-2'>
        This may be a little more challenging.
        <div className='flex flex-col mt-2 gap-y-1'>
          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>1.</span>
            <span>
              Download the emoji pack: <button className='px-3 py-0 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>Download</button>
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>2.</span>
            <span className='flex gap-x-2'>
              Extract the downloaded pack.
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>3.</span>
            <span className='flex gap-x-2'>
              Open your Discord App and right click to your server.
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>4.</span>
            <span className='flex gap-x-2'>
              Go to Server Settings {'>'} Emoji
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>5.</span>
            <span className='flex gap-x-2'>
              Select all uploaded emojis and drag and drop them to the Discord screen.
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='font-bold select-none text-primary'>6.</span>
            <span className='flex gap-x-2'>
              Tada! Now emoji pack is added to the server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}