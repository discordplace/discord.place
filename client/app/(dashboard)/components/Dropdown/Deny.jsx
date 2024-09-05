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
        <DropdownMenu.Content className='z-10 flex flex-col p-2 mb-4 border outline-none min-w-[200px] bg-secondary rounded-xl border-primary gap-y-1'>
          <div className='flex flex-col m-2 gap-y-1'>
            <h2 className='text-lg font-semibold text-primary'>
              Reason
            </h2>
            
            <p className='text-sm text-tertiary'>
              {description}
            </p>
          </div>

          {!customReason ? (
            <>
              <div className='w-full h-[1px] bg-quaternary' />

              {Object.entries(reasons).map(([key, value]) => (
                <DropdownMenu.Item 
                  key={key}
                  className='flex text-secondary items-center justify-between px-2 py-1.5 font-medium rounded-lg outline-none cursor-pointer hover:bg-quaternary text-sm gap-x-2'
                  onSelect={() => onDeny(key)}
                >
                  {value.name}
                </DropdownMenu.Item>
              ))}
            </>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              <input
                type="text"
                placeholder="Enter a reason.."
                className="w-full px-3 py-2 text-sm transition-all outline-none rounded-xl placeholder-placeholder text-secondary bg-tertiary hover:bg-quaternary hover:ring-2 ring-purple-500"
                value={value}
                onChange={event => setValue(event.target.value)}
              />

              <button
                className='w-full px-4 py-2 text-sm font-semibold transition-all rounded-xl text-primary bg-tertiary hover:bg-quaternary'
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