import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';

export default function DenyDropdown({ description, reasons, onDeny, customReason = false, children }) {
  const [value, setValue] = useState('');

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='z-[10002] mb-4 flex min-w-[200px] flex-col gap-y-1 rounded-2xl border border-primary bg-secondary p-2 outline-none'>
          <DropdownMenu.Arrow className='fill-[rgba(var(--border-primary))]' />

          <div className='m-2 flex flex-col gap-y-1'>
            <h2 className='text-lg font-semibold text-primary'>
              Reason
            </h2>

            <p className='text-sm text-tertiary'>
              {description}
            </p>
          </div>

          {!customReason ? (
            <>
              <div className='h-px w-full bg-quaternary' />

              {Object.entries(reasons).map(([key, value]) => (
                <DropdownMenu.Item
                  key={key}
                  className='flex cursor-pointer items-center justify-between gap-x-2 rounded-lg px-2 py-1.5 text-sm font-medium text-secondary outline-none hover:bg-quaternary'
                  onSelect={() => onDeny(key)}
                >
                  {value.name}
                </DropdownMenu.Item>
              ))}
            </>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              <input
                type='text'
                placeholder='Enter a reason..'
                className='w-full rounded-xl bg-tertiary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-quaternary hover:ring-2'
                value={value}
                onChange={event => setValue(event.target.value)}
              />

              <button
                className='w-full rounded-xl bg-tertiary px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-quaternary'
                onClick={() => onDeny(value)}
                onKeyUp={event => event.key === 'Enter' && onDeny(value)}
              >
                Deny Review
              </button>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}