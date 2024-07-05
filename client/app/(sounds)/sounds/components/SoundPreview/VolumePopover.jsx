'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

export default function VolumePopover({ volume, setVolume }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className='text-tertiary hover:text-secondary'>
        {volume > 0 ? <HiVolumeUp /> : <HiVolumeOff />}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='z-10 relative flex flex-col p-4 outline-none min-w-[200px] border bg-secondary/80 backdrop-blur rounded-xl border-primary gap-y-1'
          side='bottom'
          sideOffset={20}
        >
          <h2 className='text-sm font-bold text-primary'>Volume</h2>
          <p className='text-xs text-tertiary'>Adjust the volume of the sounds.</p>

          <div className='flex items-center justify-between mt-2 gap-x-2'>
            {volume > 0 ? (
              <HiVolumeUp className='text-tertiary' size={24} />
            ) : (
              <HiVolumeOff className='text-tertiary' size={24} />
            )}
            
            <input
              value={volume}
              onChange={event => setVolume(parseFloat(event.target.value))}
              type='range'
              min='0'
              max='1'
              step='0.01'
              className='w-full h-2.5 rounded-lg outline-none appearance-none cursor-pointer bg-quaternary dark:accent-white accent-black'
            />

            <span className='min-w-[32px] flex justify-end text-xs font-medium text-tertiary'>
              {(volume * 100).toFixed(0)}%
            </span>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>   
  );
}