'use client';

import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';

export default function VolumePopover() {
  const volume = useGeneralStore(state => state.sounds.volume);
  const setVolume = useGeneralStore(state => state.sounds.setVolume);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className='text-tertiary hover:text-secondary'>
        {volume > 0 ? <HiVolumeUp /> : <HiVolumeOff />}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='relative z-10 flex min-w-[200px] flex-col gap-y-1 rounded-xl border border-primary bg-secondary/80 p-4 outline-none backdrop-blur'
          side='bottom'
          sideOffset={20}
        >
          <h2 className='text-sm font-bold text-primary'>
            {t('soundCard.volumePopover.title')}
          </h2>

          <p className='text-xs text-tertiary'>
            {t('soundCard.volumePopover.subtitle')}
          </p>

          <div className='mt-2 flex items-center justify-between gap-x-2'>
            {volume > 0 ? (
              <HiVolumeUp className='text-tertiary' size={24} />
            ) : (
              <HiVolumeOff className='text-tertiary' size={24} />
            )}

            <input
              className='h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-quaternary accent-black outline-none dark:accent-white'
              max='1'
              min='0'
              onChange={event => setVolume(parseFloat(event.target.value))}
              step='0.01'
              type='range'
              value={volume}
            />

            <span className='flex min-w-[32px] justify-end text-xs font-medium text-tertiary'>
              {(volume * 100).toFixed(0)}%
            </span>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}