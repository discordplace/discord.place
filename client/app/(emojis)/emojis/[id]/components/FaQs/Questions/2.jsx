'use client';

import config from '@/config';
import Link from 'next/link';
import { useState } from 'react';
import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';

export default function Question2({ emoji }) {
  const [activeMethod, setActiveMethod] = useState(0);
  
  return (
    <div className='flex flex-col mt-2 gap-y-1'>
      <p>
        I{'\''}m glad to hear that! I will tell you 2 methods for this.
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
          2. Our Bot (recommended)
        </button>

        <button 
          className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30 disabled:pointer-events-none disabled:opacity-70'
          disabled={activeMethod === 2}
          onClick={() => setActiveMethod(2)}
        >
          3. Classic Way
        </button>
      </div>

      <div className='mt-2'>
        {activeMethod === 0 && (
          <>
            Using our bot & website, you can upload this emoji to your server with just a few clicks. Here how you can do this:
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
                  Click {'"'}Upload to Discord{'"'} button on emoji preview in this page. 
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>4.</span>
                <span className='flex gap-x-2'>
                  Select the server you want to upload the emoji & click the upload button.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>5.</span>
                <span className='flex gap-x-2'>
                  Tada! Now emoji is added to the server.
                </span>
              </div>
            </div>
          </>
        )}

        {activeMethod === 1 && (
          <>
            Using our bot, you can upload this emoji to your server with a single command. Here how you can do this:
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
                  Copy & Paste this to any channel:
                  <pre>
                    /emoji upload emoji:{emoji.id}
                  </pre>
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>3.</span>
                <span className='flex gap-x-2'>
                  Use the command and tada! Now emoji is added to the server.
                </span>
              </div>
            </div>
          </>
        )}

        {activeMethod === 2 && (
          <>
            This may be a little more challenging.
            <div className='flex flex-col mt-2 gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>1.</span>
                <span>
                  Download the emoji: <button className='px-3 py-0 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>Download</button>
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
                  Go to Server Settings {'>'} Emoji
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>4.</span>
                <span className='flex gap-x-2'>
                  Click the Upload Emoji button.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>5.</span>
                <span className='flex gap-x-2'>
                  Select the emoji you downloaded before.
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='font-bold select-none text-primary'>6.</span>
                <span className='flex gap-x-2'>
                  Tada! Now emoji is added to the server.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}