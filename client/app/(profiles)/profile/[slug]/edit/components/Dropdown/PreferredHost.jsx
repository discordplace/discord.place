import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import cn from '@/lib/cn';

export default function PreferredHostDropdown({ currentlyEditingValue, setCurrentlyEditingValue }) {
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
              currentlyEditingValue === 'discord.place/p' ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )} 
            onSelect={() => setCurrentlyEditingValue('discord.place/p')}
          >
            discord.place/p
            {currentlyEditingValue === 'discord.place/p' && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>

          <DropdownMenu.Item 
            className={cn(
              'flex items-center justify-between px-2 py-1 font-medium rounded-lg outline-none cursor-pointer gap-x-2',
              currentlyEditingValue === 'dsc.wtf' ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
            )} 
            onSelect={() => setCurrentlyEditingValue('dsc.wtf')}
          >
            dsc.wtf
            {currentlyEditingValue === 'dsc.wtf' && <IoMdCheckmarkCircle />}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>   
  );
}