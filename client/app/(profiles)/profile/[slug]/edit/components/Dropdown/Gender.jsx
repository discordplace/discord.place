'use client';

import { IoMdCheckmarkCircle } from 'react-icons/io';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export default function GenderDropdown({ profile, currentlyEditingValue, setCurrentlyEditingValue }) {
  const { t } = useTranslation();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild={true}>
        <button className='flex max-w-[200px] rounded-lg bg-tertiary px-2 py-1 text-tertiary outline-hidden hover:bg-quaternary hover:text-primary'>
          {currentlyEditingValue || 'Unknown'}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='relative top-2 z-10 flex min-w-[200px] flex-col gap-y-0.5 rounded-2xl border border-primary bg-secondary p-1.5 outline-hidden'>
          <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

          <DropdownMenu.Item
            className={cn(
              'flex cursor-pointer items-center justify-between gap-x-2 rounded-xl p-2 font-medium outline-hidden',
              (currentlyEditingValue === 'Male' || profile.gender === 'Male') ? 'pointer-events-none bg-tertiary text-primary' : 'text-tertiary data-highlighted:bg-tertiary data-highlighted:text-primary'
            )}
            onSelect={() => setCurrentlyEditingValue('Male')}
          >
            {t('profilePage.about.gender.Male')}
            {(currentlyEditingValue === 'Male' || profile.gender === 'Male') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex cursor-pointer items-center justify-between gap-x-2 rounded-xl p-2 font-medium outline-hidden',
              (currentlyEditingValue === 'Female' || profile.gender === 'Female') ? 'pointer-events-none bg-tertiary text-primary' : 'text-tertiary data-highlighted:bg-tertiary data-highlighted:text-primary'
            )}
            onSelect={() => setCurrentlyEditingValue('Female')}
          >
            {t('profilePage.about.gender.Female')}
            {(currentlyEditingValue === 'Female' || profile.gender === 'Female') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex cursor-pointer items-center justify-between gap-x-2 rounded-xl p-2 font-medium outline-hidden',
              (currentlyEditingValue === 'Unknown' || !profile.gender) ? 'pointer-events-none bg-tertiary text-primary' : 'text-tertiary data-highlighted:bg-tertiary data-highlighted:text-primary'
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