'use client';

import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { MdSunny } from 'react-icons/md';
import { IoIosMoon } from 'react-icons/io';

export default function ThemeSwitcher() {
  const { openModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal
  })));

  return (
    <button
      className='w-full px-3 py-2 text-sm font-semibold select-none sm:w-max rounded-xl text-tertiary bg-tertiary hover:text-primary hover:bg-quaternary'
      onClick={() => 
        openModal('theme-switcher', {
          maxWidth: '600px',
          title: 'Appearance Settings',
          description: 'Choose your preferred interface appearance. You have the option to pick a theme manually.',
          content: (
            <div className='flex w-full my-4 gap-x-4'>
              <div className='flex flex-col flex-1 w-full h-[280px] border border-primary rounded-lg bg-secondary'>
                <div className='pl-3 flex items-center gap-x-2 h-[40px] font-medium w-full bg-quaternary rounded-t-lg'>
                  <MdSunny />
                  Light Theme
                </div>

                <div className='flex items-center justify-center flex-1 w-full h-full'>
                </div>

                <div className='flex flex-col w-full p-3 rounded-b-lg h-[80px] bg-quaternary gap-y-1'>
                  <h3 className='text-sm font-medium text-secondary'>Light Mode</h3>
                  <p className='text-xs text-tertiary'>Bright design for well-lit environments.</p>
                </div>
              </div>

              <div className='flex flex-col flex-1 w-full h-[280px] border border-primary rounded-lg bg-secondary'>
                <div className='pl-3 flex items-center gap-x-2 h-[40px] font-medium w-full bg-quaternary rounded-t-lg'>
                  <IoIosMoon />
                  Dark Theme
                </div>

                <div className='flex flex-1 w-full h-full'>
                  sad
                </div>

                <div className='flex flex-col w-full p-3 rounded-b-lg h-[80px] bg-quaternary gap-y-1'>
                  <h3 className='text-sm font-medium text-secondary'>Dark Mode</h3>
                  <p className='text-xs text-tertiary'>Eye-friendly design for low-light environments.</p>
                </div>
              </div>
            </div>
          ),
          buttons: [
            {
              id: 'cancel',
              label: 'Cancel',
              variant: 'ghost',
              actionType: 'close'
            },
            {
              id: 'save-changes',
              label: 'Save Changes',
              variant: 'solid',
              action: () => {
                console.log('Saving changes...');
              }
            }
          ]
        })
      }
    >
      Theme Switcher
    </button>
  );
}

/*import { Drawer } from 'vaul';
import { useState } from 'react';
import ThemePreviewButton from '@/app/components/Footer/ThemeSwitcher/PreviewButton';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root 
      shouldScaleBackground={true} 
      closeThreshold={0.5} 
      open={open} 
      onOpenChange={setOpen}
    >
      <Drawer.Trigger asChild>
        <button className='w-full px-3 py-2 text-sm font-semibold sm:w-max rounded-xl text-tertiary bg-tertiary hover:text-primary hover:bg-quaternary' onClick={() => setOpen(true)}>
          Theme Switcher
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className='outline-none gap-y-1 p-4 z-[10001] bg-secondary flex flex-col rounded-t-3xl fixed bottom-0 left-0 right-0'>
          <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-quaternary mb-8' />
        
          <h2 className='text-lg font-semibold text-center text-primary'>Theme Switcher</h2>
          <p className='text-sm text-center text-tertiary'>Choose your preferred theme</p>

          <div className='flex flex-col items-center mt-4 gap-y-4'>
            <ThemePreviewButton theme='light' imagePath='/theme-preview_light.png' />
            <ThemePreviewButton theme='dark' imagePath='/theme-preview_dark.png' />
          </div>
        </Drawer.Content>
        <Drawer.Overlay className='fixed inset-0 bg-white/40 dark:bg-black/40 z-[10000]' />
      </Drawer.Portal>
    </Drawer.Root>
  );
}*/