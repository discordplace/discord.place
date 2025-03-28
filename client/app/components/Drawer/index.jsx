'use client';

import { IoMdCheckmarkCircle } from '@/icons';
import cn from '@/lib/cn';
import { nanoid } from 'nanoid';import { Drawer } from 'vaul';

export default function CustomDrawer({ openState, setOpenState, state, setState, items, preventDefault = false }) {
  return (
    <Drawer.Root
      shouldScaleBackground={true}
      closeThreshold={0.5}
      open={openState}
      onOpenChange={setOpenState}
    >
      <Drawer.Portal>
        <Drawer.Content className='fixed inset-x-0 bottom-0 z-[10001] flex h-max flex-col gap-y-1 rounded-t-3xl bg-secondary p-4 outline-none'>
          <div className='mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-quaternary' />
          <div className='flex max-h-[80svh] w-full flex-col gap-y-2 overflow-y-auto'>
            {items.map(item => (
              <button
                key={nanoid()}
                onClick={() => {
                  if (preventDefault === true) return;

                  setState(item.value);
                  setOpenState(false);
                }}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg disabled:pointer-events-none',
                  state === item.value ? 'pointer-events-none bg-quaternary text-primary' : 'sm:hover:bg-quaternary text-tertiary sm:hover:text-primary'
                )}
              >
                {item.label}
                {state === item.value && <IoMdCheckmarkCircle />}
              </button>
            ))}
          </div>
        </Drawer.Content>
        <Drawer.Overlay className='fixed inset-0 z-[10000] bg-white/40 dark:bg-black/40' />
      </Drawer.Portal>
    </Drawer.Root>
  );
}