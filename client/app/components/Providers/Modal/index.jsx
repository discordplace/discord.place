'use client';

import cn from '@/lib/cn';
import useModalsStore from '@/stores/modals';
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdCloseCircle } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { useShallow } from 'zustand/react/shallow';
import { Drawer } from 'vaul';
import { useMedia } from 'react-use';

export default function ModalProvider({ children }) {
  const { openedModals, activeModalId, closeModal } = useModalsStore(useShallow(state => ({
    openedModals: state.openedModals,
    activeModalId: state.activeModalId,
    closeModal: state.closeModal
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
                <Drawer.Content className='outline-none gap-y-1 p-6 z-[10001] bg-quaternary dark:bg-background flex flex-col rounded-t-3xl h-max fixed bottom-0 left-0 right-0'>
                  <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-background dark:bg-quaternary mb-8' />

                  <div className='flex flex-col gap-y-2'>
                    <h2 className='text-lg font-semibold text-primary'>{data.title}</h2>
                    <p className='text-sm text-secondary'>{data.description}</p>

                    <div className='flex flex-col text-sm gap-y-2'>
                      {data.content}
                    </div>

                    <div className='flex flex-col mt-4 gap-y-2'>
                      {/*
                        Using [...new Set(data.buttons || [])] to create a new array with buttons
                        so when we use data.buttons again, it won't be reversed and will be in the original order
                      */}
                      
                      {([...new Set(data.buttons || [])]).reverse().map((button, index) => (
                        <button
                          key={index}
                          onClick={button.actionType === 'close' ? () => closeModal(id) : button.action}
                          className={cn(
                            'w-full rounded-full justify-center py-2 px-4 flex select-none items-center gap-x-1 font-medium outline-none',
                            button.variant === 'solid' && 'font-semibold dark:bg-white dark:text-black dark:hover:bg-white/70 text-white bg-black hover:bg-black/70',
                            button.variant === 'ghost' && 'text-secondary hover:bg-quaternary hover:text-primary',
                            button.variant === 'outlined' && 'border border-[rgba(var(--bg-quaternary))] text-secondary hover:text-primary',
                            button.disabled && 'opacity-50 pointer-events-none'
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
                <Drawer.Overlay className='fixed inset-0 bg-white/50 dark:bg-black/50 z-[10000]' />
              </Drawer.Portal>
            </Drawer.Root>
          </>
        ) : (
          <Dialog.Root
            key={id}
            open={activeModalId === id}
            onOpenChange={open => !open && closeModal(id)}
          >
            <Dialog.Overlay className='backdrop-blur-sm radix-overlay fixed z-[9999] inset-0 bg-white/50 dark:bg-black/50' />
            <Dialog.Content className="radix-dialog-content fixed focus:outline-none z-[9999] flex items-center justify-center w-full h-full">
              <div className='border border-primary bg-secondary dark:bg-tertiary rounded-2xl flex flex-col gap-y-2 max-h-[85vh] w-[90vw] max-w-[450px]'>
                <div className='flex items-center justify-between px-6 pt-6'>
                  <Dialog.Title className='flex items-center text-lg font-semibold text-primary gap-x-2'>
                    {data.title}
                  </Dialog.Title>

                  <Dialog.Close asChild>
                    <IoMdCloseCircle className='cursor-pointer hover:opacity-70' />
                  </Dialog.Close>
                </div>
                                
                <Dialog.Description className='px-6 text-base text-secondary'>
                  {data.description}
                </Dialog.Description>

                <div className='flex flex-col px-6 my-2 text-sm'>
                  {data.content}
                </div>

                {(data.buttons || [])?.length > 0 && (
                  <>                    
                    <div className='flex justify-end px-4 py-3 text-sm gap-x-3 bg-tertiary dark:bg-secondary rounded-b-2xl'>
                      {data.buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={button.actionType === 'close' ? () => closeModal(id) : button.action}
                          className={cn(
                            'w-max py-2 px-4 flex select-none items-center gap-x-1 font-medium rounded-lg outline-none',
                            button.variant === 'solid' && 'font-semibold dark:bg-white dark:text-black dark:hover:bg-white/70 text-white bg-black hover:bg-black/70',
                            button.variant === 'ghost' && 'text-secondary hover:bg-quaternary hover:text-primary',
                            button.variant === 'outlined' && 'border border-[rgba(var(--bg-quaternary))] text-secondary hover:text-primary',
                            button.disabled && 'opacity-50 pointer-events-none'
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