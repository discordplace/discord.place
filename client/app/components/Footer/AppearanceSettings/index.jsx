'use client';

import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import { MdSunny } from 'react-icons/md';
import { IoIosMoon, IoMdCheckmarkCircle } from 'react-icons/io';
import Image from 'next/image';
import useThemeStore from '@/stores/theme';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';

export default function AppearanceSettings() {
  const { openModal, updateModal, openedModals, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    updateModal: state.updateModal,
    openedModals: state.openedModals,
    closeModal: state.closeModal
  })));

  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);
  const [storedTheme, setStoredTheme] = useState(theme);
  
  function openAppearanceSettings() {
    const id = 'theme-switcher';
    const data = {
      maxWidth: '680px',
      title: 'Appearance Settings',
      description: 'Choose your preferred interface appearance. You have the option to pick a theme manually.',
      content: (
        <div className='flex w-full my-4 gap-x-4'>
          <div
            className={cn(
              'flex flex-col flex-1 w-full h-[280px] border border-primary select-none rounded-lg bg-secondary',
              storedTheme === 'light' ? 'ring-2 ring-purple-500 pointer-events-none' : 'cursor-pointer hover:ring-2 ring-purple-500'
            )}
            onClick={() => setStoredTheme('light')}
          >
            <div className='pl-3 flex items-center gap-x-2 h-[70px] font-medium w-full bg-quaternary rounded-t-lg'>
              <MdSunny />
              Light Theme
            </div>

            <div className='flex items-center justify-center w-full h-full'>
              <div className='relative z-0 flex flex-1 [zoom:0.85] justify-center w-full'>
                <Image
                  src='/theme-preview-light-mode.png'
                  alt='Light Mode Preview'
                  width={305}
                  height={174}
                  className='w-[305px] pointer-events-none [user-drag:none] h-[174px] rounded-xl'
                  draggable={false}
                />
              </div>
            </div>

            <div className='flex flex-col w-full p-3 rounded-b-lg bg-quaternary gap-y-1'>
              <h3 className='flex items-center text-sm font-medium gap-x-1 text-secondary'>
                Light Mode
                
                {storedTheme === 'light' && (
                  <IoMdCheckmarkCircle />
                )}  
              </h3>
              <p className='text-xs text-tertiary'>Bright design for well-lit environments.</p>
            </div>
          </div>

          <div
            className={cn(
              'flex flex-col flex-1 w-full h-[280px] border border-primary select-none rounded-lg bg-secondary',
              storedTheme === 'dark' ? 'ring-2 ring-purple-500 pointer-events-none' : 'cursor-pointer hover:ring-2 ring-purple-500'
            )}
            onClick={() => setStoredTheme('dark')}
          >
            <div className='pl-3 flex items-center gap-x-2 h-[70px] font-medium w-full bg-quaternary rounded-t-lg'>
              <IoIosMoon />
              Dark Theme
            </div>

            <div className='flex items-center justify-center w-full h-full'>
              <div className='relative z-0 flex flex-1 [zoom:0.85] justify-center w-full'>
                <Image
                  src='/theme-preview-dark-mode.png'
                  alt='Dark Mode Preview'
                  width={305}
                  height={174}
                  className='w-[305px] pointer-events-none [user-drag:none] h-[174px] rounded-xl'
                  draggable={false}
                />
              </div>
            </div>

            <div className='flex flex-col w-full p-3 rounded-b-lg bg-quaternary gap-y-1'>
              <h3 className='flex items-center text-sm font-medium gap-x-1 text-secondary'>
                Dark Mode
            
                {storedTheme === 'dark' && (
                  <IoMdCheckmarkCircle />
                )}  
              </h3>
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
            setTheme(storedTheme);
            closeModal(id);
          }
        }
      ]
    };

    if (openedModals.some(modal => modal.id === id)) updateModal(id, data);
    else openModal(id, data);
  }

  useEffect(() => {
    openAppearanceSettings();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedTheme]);

  return (
    <button
      className='w-full px-3 py-2 text-sm font-semibold select-none sm:w-max rounded-xl text-tertiary bg-tertiary hover:text-primary hover:bg-quaternary'
      onClick={openAppearanceSettings}
    >
      Appearance Settings
    </button>
  );
}