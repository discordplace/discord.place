'use client';

import cn from '@/lib/cn';
import { nanoid } from 'nanoid';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Drawer } from 'vaul';

export default function CustomDrawer({ openState, setOpenState, state, setState, items }) {
  return (
    <Drawer.Root
      shouldScaleBackground={true}
      closeThreshold={0.5}
      open={openState}
      onOpenChange={setOpenState}
    >
      <Drawer.Portal>
        <Drawer.Content className='outline-none gap-y-1 p-4 z-[10001] bg-secondary flex flex-col rounded-t-3xl h-max fixed bottom-0 left-0 right-0'>
          <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-quaternary mb-8' />
          
          <div className='h-full max-h-[80dvh] gap-y-2 overflow-y-auto w-full flex flex-col'>
            {items.map(item => (
              <button
                key={nanoid()}
                onClick={() => {
                  setState(item.value);
                  setOpenState(false);
                }}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg disabled:pointer-events-none',
                  state === item.value ? 'pointer-events-none bg-quaternary text-primary' : 'hover:bg-quaternary text-tertiary hover:text-primary'
                )}
              >
                {item.label}
                {state === item.value && <IoMdCheckmarkCircle />}
              </button>
            ))}
          </div>
        </Drawer.Content>
        <Drawer.Overlay className='fixed inset-0 bg-white/40 dark:bg-black/40 z-[10000]' />
      </Drawer.Portal>
    </Drawer.Root>
  );
}