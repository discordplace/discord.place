'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { IoChevronDownSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { useMedia } from 'react-use';
import Drawer from '@/app/components/Drawer';
import { useState } from 'react';
import cn from '@/lib/cn';

export default function Select({ mobileOverride, triggerClassName, placeholder, options, value, onChange, disabled }) {
  const isMobile = useMedia('(max-width: 640px)', false);
  const [openState, setOpenState] = useState(false);

  return (
    (mobileOverride || isMobile) ? (
      <>
        <div
          className={cn(
            'inline-flex cursor-pointer items-center justify-center rounded-lg py-[1rem] w-full leading-none border-2 border-primary px-2 sm:px-4 gap-1 sm:gap-4 bg-secondary transition-all text-tertiary select-none font-medium outline-none',
            openState && 'border-purple-500 bg-quaternary',
            disabled && 'opacity-50 pointer-events-none',
            triggerClassName
          )}
          onClick={() => setOpenState(!openState)}
          aria-label={placeholder}
        >
          {options.find(option => option.value === value)?.label || placeholder}

          <IoChevronDownSharp
            className={cn(
              'text-tertiary transition-transform duration-300',
              openState && 'transform rotate-180'
            )}
          />
        </div>

        <Drawer
          openState={openState}
          setOpenState={setOpenState}
          state={value}
          setState={onChange}
          items={options}
        />
      </>
    ) : (
      <RadixSelect.Root
        open={openState}
        onOpenChange={setOpenState}
        value={value}
        onValueChange={onChange}
      >
        <RadixSelect.Trigger
          className={cn(
            'inline-flex items-center justify-center rounded-lg py-[1rem] w-max leading-none border-2 border-primary px-4 gap-4 bg-secondary hover:bg-tertiary focus-visible:border-purple-500 transition-all focus-visible:bg-quaternary text-tertiary select-none font-medium outline-none data-[state=open]:border-purple-500 data-[state=open]:bg-quaternary',
            disabled && 'opacity-50 pointer-events-none',
            triggerClassName
          )}
          aria-label={placeholder}
        >
          <RadixSelect.Value placeholder={placeholder} />

          <RadixSelect.Icon className="text-tertiary">
            <IoChevronDownSharp />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
    
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-[9999] overflow-hidden border-2 rounded-lg border-primary bg-secondary">
            <RadixSelect.ScrollUpButton className="absolute flex items-center justify-center w-full py-3 rounded-b bg-gradient-to-b from-quaternary via-quaternary/50" />

            <RadixSelect.Viewport>
              {options.map(option => (
                <RadixSelect.Item
                  key={option.value}
                  className='transition-colors leading-none font-medium text-tertiary flex items-center p-4 gap-x-2 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none cursor-pointer data-[highlighted]:bg-tertiary data-[highlighted]:text-primary data-[state=checked]:bg-quaternary data-[state=checked]:pointer-events-none data-[state=checked]:text-primary'
                  value={option.value}
                >
                  <RadixSelect.ItemText>
                    {option.label}
                  </RadixSelect.ItemText>

                  <RadixSelect.ItemIndicator className="inline-flex ml-auto">
                    <IoCheckmarkCircleSharp />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>

            <RadixSelect.ScrollDownButton className="absolute left-[2.5px] flex items-center justify-center w-full max-w-[97%] bottom-0 rounded-b py-3 bg-gradient-to-t from-quaternary via-quaternary/50" />
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  );
}