import { IoMdCheckmarkCircle } from '@/icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
        <DropdownMenu.Content className='relative top-2 z-10 flex min-w-[200px] flex-col gap-y-0.5 rounded-2xl border border-primary bg-secondary p-1.5 outline-none'>
          <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

          <DropdownMenu.Item
            className={cn(
              'flex items-center justify-between p-2 font-medium rounded-xl outline-none cursor-pointer gap-x-2',
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
                'flex items-center justify-between p-2 font-medium rounded-xl outline-none cursor-pointer gap-x-2',
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