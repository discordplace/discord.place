'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tooltip({ children, content }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  
  return (
    <RadixTooltip.Provider 
      delayDuration='0' 
      skipDelayDuration='0'
    >
      <RadixTooltip.Root
        onOpenChange={setOpen}
        open={open}
      >
        <RadixTooltip.Trigger 
          onClick={() => isMobile && setOpen(!open)}
          asChild
        >
          {children}
        </RadixTooltip.Trigger>
        {content && (
          <RadixTooltip.Portal>
            <RadixTooltip.Content className='text-sm z-[10000] px-3 py-1 font-semibold dark:bg-white dark:text-black text-white bg-black rounded-lg [transform-origin:var(--radix-tooltip-content-transform-origin)]' sideOffset={5}>
              {content}
              <RadixTooltip.Arrow className='dark:fill-white fill-black' />
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        )}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}