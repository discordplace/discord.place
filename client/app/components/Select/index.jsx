'use client';

import { IoCheckmarkCircleSharp, IoChevronDownSharp } from 'react-icons/io5';
import * as RadixSelect from '@radix-ui/react-select';
import { useMedia } from 'react-use';
import Drawer from '@/app/components/Drawer';
import { useState } from 'react';
import cn from '@/lib/cn';

export default function Select({ mobileOverride, triggerClassName, placeholder, options, value, onChange, disabled, itemContainerClassName, position = 'item-aligned', sideOffset = 0 }) {
  const isMobile = useMedia('(max-width: 640px)', false);
  const [openState, setOpenState] = useState(false);

  return (
    (mobileOverride || isMobile) ? (
      <>
        <div
          className={cn(
            'inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border-2 border-primary bg-secondary px-2 py-4 leading-none font-medium text-tertiary outline-hidden transition-all select-none sm:gap-4 sm:px-4',
            openState && 'border-purple-500 bg-quaternary',
            disabled && 'pointer-events-none opacity-50',
            triggerClassName
          )}
          onClick={() => setOpenState(!openState)}
          aria-label={placeholder}
        >
          {options.find(option => option.value === value)?.label || placeholder}

          <IoChevronDownSharp
            className={cn(
              'text-tertiary transition-transform duration-300',
              openState && 'rotate-180 transform'
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
            'inline-flex w-max items-center justify-center gap-4 rounded-lg border-2 border-primary bg-secondary p-4 leading-none font-medium text-tertiary outline-hidden transition-all select-none hover:bg-tertiary focus-visible:border-purple-500 focus-visible:bg-quaternary data-[state=open]:border-purple-500 data-[state=open]:bg-quaternary',
            disabled && 'pointer-events-none opacity-50',
            triggerClassName
          )}
          aria-label={placeholder}
        >
          <RadixSelect.Value placeholder={placeholder} />

          <RadixSelect.Icon className='text-tertiary'>
            <IoChevronDownSharp />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className='z-9999 overflow-hidden rounded-lg border-2 border-primary bg-secondary'
            position={position}
            sideOffset={sideOffset}
            align='center'
          >
            <RadixSelect.ScrollUpButton className='absolute flex w-full items-center justify-center rounded-b bg-linear-to-b from-quaternary via-quaternary/50 py-3' />

            <RadixSelect.Viewport>
              {options.map(option => (
                <RadixSelect.Item
                  key={option.value}
                  className={cn(
                    'relative flex cursor-pointer items-center gap-x-2 p-4 leading-none font-medium text-tertiary transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-tertiary data-highlighted:text-primary data-highlighted:outline-hidden data-[state=checked]:pointer-events-none data-[state=checked]:bg-quaternary data-[state=checked]:text-primary',
                    itemContainerClassName
                  )}
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

            <RadixSelect.ScrollDownButton className='absolute bottom-0 left-[2.5px] flex w-full max-w-[97%] items-center justify-center rounded-b bg-linear-to-t from-quaternary via-quaternary/50 py-3' />
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    )
  );
}