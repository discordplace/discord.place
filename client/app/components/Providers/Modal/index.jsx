'use client';

import { IoMdCloseCircle } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import cn from '@/lib/cn';
import useModalsStore from '@/stores/modals';
import * as Dialog from '@radix-ui/react-dialog';
import { useShallow } from 'zustand/react/shallow';
import { Drawer } from 'vaul';
import { useMedia } from 'react-use';

export default function ModalProvider({ children }) {
  const { openedModals, activeModalId, closeModal } = useModalsStore(useShallow(state => ({
    activeModalId: state.activeModalId,
    closeModal: state.closeModal,
    openedModals: state.openedModals
  })));

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <>
      {openedModals.map(({ id, data }) => (
        isMobile ? (
          <>
            <Drawer.Root
              shouldScaleBackground={false}
              closeThreshold={0.5}
              open={activeModalId === id}
              onOpenChange={open => !open && closeModal(id)}
            >
              <Drawer.Portal>
                <Drawer.Content className='fixed inset-x-0 bottom-0 z-10001 flex h-max flex-col gap-y-1 rounded-t-3xl bg-quaternary p-6 outline-hidden dark:bg-background'>
                  <div className='mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-background dark:bg-quaternary' />

                  <div className='flex flex-col gap-y-2'>
                    <h2 className='text-lg font-semibold text-primary'>{data.title}</h2>
                    <p className='text-sm text-secondary'>{data.description}</p>

                    <div className='flex flex-col gap-y-2 text-sm'>
                      {data.content}
                    </div>

                    <div className='mt-4 flex flex-col gap-y-2'>
                      {/*
                        Using [...new Set(data.buttons || [])] to create a new array with buttons
                        so when we use data.buttons again, it won't be reversed and will be in the original order
                      */}

                      {([...new Set(data.buttons || [])]).reverse().map((button, index) => (
                        <button
                          key={index}
                          onClick={button.actionType === 'close' ? () => closeModal(id) : button.action}
                          className={cn(
                            'flex w-full items-center justify-center gap-x-1 rounded-full px-4 py-2 font-medium outline-hidden select-none',
                            button.variant === 'solid' && 'bg-black font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
                            button.variant === 'ghost' && 'text-secondary hover:bg-quaternary hover:text-primary',
                            button.variant === 'outlined' && 'border border-[rgba(var(--bg-quaternary))] text-secondary hover:text-primary',
                            button.disabled && 'pointer-events-none opacity-50'
                          )}
                          disabled={button.disabled}
                        >
                          {button.label}
                          {button.disabled && button.actionType !== 'close' && <TbLoader className='animate-spin' />}
                        </button>
                      ))}
                    </div>
                  </div>
                </Drawer.Content>
                <Drawer.Overlay className='fixed inset-0 z-10000 bg-white/50 dark:bg-black/50' />
              </Drawer.Portal>
            </Drawer.Root>
          </>
        ) : (
          <Dialog.Root
            key={id}
            open={activeModalId === id}
            onOpenChange={open => !open && closeModal(id)}
          >
            {/* oxlint-disable-next-line tailwindcss/no-unknown-classes */}
            <Dialog.Overlay className='radix-overlay fixed inset-0 z-9999 bg-white/50 backdrop-blur-xs dark:bg-black/50' />
            <Dialog.Content
              // oxlint-disable-next-line tailwindcss/no-unknown-classes
              className='radix-dialog-content fixed z-9999 flex size-full items-center justify-center focus:outline-hidden'
              aria-describedby={id}
            >
              <div
                className='flex max-h-[85vh] w-[90vw] flex-col gap-y-2 rounded-2xl border border-primary bg-secondary dark:bg-tertiary'
                style={{ maxWidth: data.maxWidth || '450px' }}
              >
                <div className='flex items-center justify-between px-6 pt-6'>
                  <Dialog.Title className='flex items-center gap-x-2 text-lg font-semibold text-primary'>
                    {data.title}
                  </Dialog.Title>

                  <Dialog.Close asChild={true}>
                    <IoMdCloseCircle className='cursor-pointer hover:opacity-70' />
                  </Dialog.Close>
                </div>

                <Dialog.Description className='px-6 text-base text-secondary'>
                  {data.description}
                </Dialog.Description>

                <div className='my-2 flex flex-col px-6 text-sm'>
                  {data.content}
                </div>

                {(data.buttons || [])?.length > 0 && (
                  <>
                    <div className='flex justify-end gap-x-3 rounded-b-2xl bg-tertiary px-4 py-3 text-sm dark:bg-secondary'>
                      {data.buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={button.actionType === 'close' ? () => closeModal(id) : button.action}
                          className={cn(
                            'flex w-max items-center gap-x-1 rounded-lg px-4 py-2 font-medium outline-hidden select-none',
                            button.variant === 'solid' && 'bg-black font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70',
                            button.variant === 'ghost' && 'text-secondary hover:bg-quaternary hover:text-primary',
                            button.variant === 'outlined' && 'border border-[rgba(var(--bg-quaternary))] text-secondary hover:text-primary',
                            button.disabled && 'pointer-events-none opacity-50'
                          )}
                          disabled={button.disabled}
                        >
                          {button.label}
                          {button.disabled && button.actionType !== 'close' && <TbLoader className='animate-spin' />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Root>
        )
      ))}

      {children}
    </>
  );
}