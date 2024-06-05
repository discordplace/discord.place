'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tooltip({ children, content, side, hide, doNotHideOnClick }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia('(max-width: 640px)', false);
  
  return (
    <RadixTooltip.Provider 
      delayDuration='0'
      skipDelayDuration='0'
    >
      <RadixTooltip.Root
        onOpenChange={newOpenState => {
          if (newOpenState === false && doNotHideOnClick) return;
          if (hide) return;

          setOpen(newOpenState);
        }}        open={open}
      >
        <RadixTooltip.Trigger 
          onClick={() => {
            if (hide) return;
            
            if (isMobile) setOpen(!open);
          }}
          asChild
        >
          {children}
        </RadixTooltip.Trigger>
        {content && (
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              className='[transform-origin:var(--radix-tooltip-content-transform-origin)] text-sm max-w-[300px] sm:max-w-[unset] text-center z-[10000] px-3 py-1 font-semibold rounded-lg dark:bg-white dark:text-black text-white bg-black'
              sideOffset={5}
              side={side || 'top'}
            >
              {content}
              <RadixTooltip.Arrow className='dark:fill-white fill-black'/>
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        )}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}