'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function GenderDropdown({ profile, currentlyEditingValue, setCurrentlyEditingValue }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className='flex max-w-[200px] px-2 py-1 bg-tertiary text-tertiary hover:text-primary hover:bg-quaternary rounded-lg outline-none'>
          {currentlyEditingValue || 'Unknown'}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='z-10 flex flex-col p-2 mt-2 border outline-none min-w-[200px] bg-secondary rounded-xl border-primary gap-y-1'>
          <DropdownMenu.Item 
            className={cn(
              'flex items-center justify-between px-2 py-1 font-medium rounded-lg outline-none cursor-pointer gap-x-2',
              (currentlyEditingValue === 'Male' || profile.gender === 'Male') ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )} 
            onSelect={() => setCurrentlyEditingValue('Male')}
          >
            {t('profilePage.about.gender.Male')}
            {(currentlyEditingValue === 'Male' || profile.gender === 'Male') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item 
            className={cn(
              'flex items-center justify-between px-2 py-1 font-medium rounded-lg outline-none cursor-pointer gap-x-2',
              (currentlyEditingValue === 'Female' || profile.gender === 'Female') ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )} 
            onSelect={() => setCurrentlyEditingValue('Female')}
          >
            {t('profilePage.about.gender.Female')}
            {(currentlyEditingValue === 'Female' || profile.gender === 'Female') && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item 
            className={cn(
              'flex items-center justify-between px-2 py-1 font-medium rounded-lg outline-none cursor-pointer gap-x-2',
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