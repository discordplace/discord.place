'use client';

import { IoMdCheckmarkCircle } from '@/icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function GenderDropdown({ profile, currentlyEditingValue, setCurrentlyEditingValue }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className='flex max-w-[200px] rounded-lg bg-tertiary px-2 py-1 text-tertiary outline-none hover:bg-quaternary hover:text-primary'>
          {currentlyEditingValue || 'Unknown'}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='relative top-2 z-10 flex min-w-[200px] flex-col gap-y-0.5 rounded-2xl border border-primary bg-secondary p-1.5 outline-none'>
          <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

          <DropdownMenu.Item
            className={cn(
              'flex items-center justify-between p-2 font-medium rounded-xl outline-none cursor-pointer gap-x-2',
              (currentlyEditingValue === 'Male' || profile.gender === 'Male') ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )}
            onSelect={() => setCurrentlyEditingValue('Male')}
          >
            {t('profilePage.about.gender.Male')}
            {(currentlyEditingValue === 'Male' || profile.gender === 'Male') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex items-center justify-between p-2 font-medium rounded-xl outline-none cursor-pointer gap-x-2',
              (currentlyEditingValue === 'Female' || profile.gender === 'Female') ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )}
            onSelect={() => setCurrentlyEditingValue('Female')}
          >
            {t('profilePage.about.gender.Female')}
            {(currentlyEditingValue === 'Female' || profile.gender === 'Female') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex items-center justify-between p-2 font-medium rounded-xl outline-none cursor-pointer gap-x-2',
              (currentlyEditingValue === 'Unknown' || !profile.gender) ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )}
            onSelect={() => setCurrentlyEditingValue('Unknown')}
          >
            {t('profilePage.about.valueUnknown')}
            {(currentlyEditingValue === 'Unknown' || !profile.gender) && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}