import { Drawer } from 'vaul';
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
}