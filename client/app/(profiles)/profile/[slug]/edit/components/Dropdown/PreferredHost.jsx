import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import cn from '@/lib/cn';
import config from '@/config';

export default function PreferredHostDropdown({ currentlyEditingValue, setCurrentlyEditingValue }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className='flex max-w-[200px] rounded-lg bg-tertiary px-2 py-1 text-tertiary outline-none hover:bg-quaternary hover:text-primary'>
          {currentlyEditingValue || 'Unknown'}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='z-10 mt-2 flex min-w-[200px] flex-col gap-y-1 rounded-xl border border-primary bg-secondary p-2 outline-none'>
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

          {config.customHostnames.map(hostname => (
            <DropdownMenu.Item
              key={hostname}
              className={cn(
                'flex items-center justify-between px-2 py-1 font-medium rounded-lg outline-none cursor-pointer gap-x-2',
                currentlyEditingValue === hostname ? 'bg-tertiary text-primary pointer-events-none' : 'data-[highlighted]:bg-tertiary text-tertiary data-[highlighted]:text-primary'
              )}
              onSelect={() => setCurrentlyEditingValue(hostname)}
            >
              {hostname}
              {currentlyEditingValue === hostname && <IoMdCheckmarkCircle />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}