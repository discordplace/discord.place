'use client';

import { HiVolumeOff, HiVolumeUp } from '@/icons';
import useGeneralStore from '@/stores/general';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { t } from '@/stores/language';

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
          <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

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
              value={volume}
              onChange={event => setVolume(parseFloat(event.target.value))}
              type='range'
              min='0'
              max='1'
              step='0.01'
              className='h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-quaternary accent-black outline-none dark:accent-white'
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