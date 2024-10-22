'use client';

import Drawer from '@/app/components/Drawer';
import cn from '@/lib/cn';
import * as RadixSelect from '@radix-ui/react-select';
import { useState } from 'react';
import { IoCheckmarkCircleSharp, IoChevronDownSharp } from 'react-icons/io5';
import { useMedia } from 'react-use';

export default function Select({ disabled, mobileOverride, onChange, options, placeholder, triggerClassName, value }) {
  const isMobile = useMedia('(max-width: 640px)', false);
  const [openState, setOpenState] = useState(false);

  return (
    (mobileOverride || isMobile) ? (
      <>
        <div
          aria-label={placeholder}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center rounded-lg py-[1rem] w-full leading-none border-2 border-primary px-2 sm:px-4 gap-1 sm:gap-4 bg-secondary transition-all text-tertiary select-none font-medium outline-none',
            openState && 'border-purple-500 bg-quaternary',
            disabled && 'opacity-50 pointer-events-none',
            triggerClassName
          )}
          onClick={() => setOpenState(!openState)}
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
          items={options}
          openState={openState}
          setOpenState={setOpenState}
          setState={onChange}
          state={value}
        />
      </>
    ) : (
      <RadixSelect.Root
        onOpenChange={setOpenState}
        onValueChange={onChange}
        open={openState}
        value={value}
      >
        <RadixSelect.Trigger
          aria-label={placeholder}
          className={cn(
            'inline-flex items-center justify-center rounded-lg py-[1rem] w-max leading-none border-2 border-primary px-4 gap-4 bg-secondary hover:bg-tertiary focus-visible:border-purple-500 transition-all focus-visible:bg-quaternary text-tertiary select-none font-medium outline-none data-[state=open]:border-purple-500 data-[state=open]:bg-quaternary',
            disabled && 'opacity-50 pointer-events-none',
            triggerClassName
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />

          <RadixSelect.Icon className='text-tertiary'>
            <IoChevronDownSharp />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className='z-[9999] overflow-hidden rounded-lg border-2 border-primary bg-secondary'>
            <RadixSelect.ScrollUpButton className='absolute flex w-full items-center justify-center rounded-b bg-gradient-to-b from-quaternary via-quaternary/50 py-3' />

            <RadixSelect.Viewport>
              {options.map(option => (
                <RadixSelect.Item
                  className='relative flex cursor-pointer select-none items-center gap-x-2 p-4 font-medium leading-none text-tertiary transition-colors data-[disabled]:pointer-events-none data-[state=checked]:pointer-events-none data-[highlighted]:bg-tertiary data-[state=checked]:bg-quaternary data-[highlighted]:text-primary data-[state=checked]:text-primary data-[disabled]:opacity-50 data-[highlighted]:outline-none'
                  key={option.value}
                  value={option.value}
                >
                  <RadixSelect.ItemText>
                    {option.label}
                  </RadixSelect.ItemText>

                  <RadixSelect.ItemIndicator className='ml-auto inline-flex'>
                    <IoCheckmarkCircleSharp />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>

            <RadixSelect.ScrollDownButton className='absolute bottom-0 left-[2.5px] flex w-full max-w-[97%] items-center justify-center rounded-b bg-gradient-to-t from-quaternary via-quaternary/50 py-3' />
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  );
}