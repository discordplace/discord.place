'use client';

import { useState } from 'react';
import downloadSound from '@/lib/utils/sounds/downloadSound';
import Link from 'next/link';
import config from '@/config';

export default function Question2({ sound }) {
  const [activeMethod, setActiveMethod] = useState(0);
 
  return (
    <div className='flex flex-col mt-2 gap-y-1'>
      <p>
        I{'\''}m glad to hear that! There are 2 ways to add sounds to your Discord server.
      </p>

      <div className='flex gap-x-2'>
        <button 
          className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30 disabled:pointer-events-none disabled:opacity-70'
          disabled={activeMethod === 0}
          onClick={() => setActiveMethod(0)}
        >
          1. Our Website (this page)
        </button>

        <button
          className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30 disabled:pointer-events-none disabled:opacity-70'
          disabled={activeMethod === 1}
          onClick={() => setActiveMethod(1)}
        >
          2. Classic Way
        </button>
      </div>

      <div className='mt-2'>
        {activeMethod === 0 && (
          <>
            Using our website, you can upload this sound to your server with just a few clicks. Here how you can do this:
            <div className='flex flex-col mt-2 gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>1.</span>
                <span>
                  <Link href={config.botInviteURL} target='_blank' className='underline hover:text-primary'>Add our bot</Link> to your server.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>2.</span>
                <span>
                  Click {'"'}Upload to Discord{'"'} button on sound card in this page. 
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>4.</span>
                <span className='flex gap-x-2'>
                  Select the server you want to upload the sound & click the upload button.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>5.</span>
                <span className='flex gap-x-2'>
                  Tada! Now sound is added to the server.
                </span>
              </div>
            </div>
          </>
        )}

        {activeMethod === 1 && (
          <>
            This may be a little more challenging.
            <div className='flex flex-col mt-2 gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>1.</span>
                <span>
                  Download the sound:{' '}
                  <button
                    className='px-3 py-0 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30'
                    onClick={() => downloadSound(sound)}
                  >
                    Download
                  </button>
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>2.</span>
                <span className='flex gap-x-2'>
                  Open your Discord App and right click to your server.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>3.</span>
                <span className='flex gap-x-2'>
                  Go to Server Settings {'>'} Soundboard
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>4.</span>
                <span className='flex gap-x-2'>
                  Click the Upload Sound.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>5.</span>
                <span className='flex gap-x-2'>
                  Fill the form and select the sound you downloaded before and click the Upload button.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>6.</span>
                <span className='flex gap-x-2'>
                  Tada! Now sound is added to the server.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}