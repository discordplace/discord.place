'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tooltip({ children, content, side, sideOffset, hide, disableHoverableContent = false }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <RadixTooltip.Provider
      delayDuration='0'
      skipDelayDuration='0'
      disableHoverableContent={disableHoverableContent === true}
    >
      <RadixTooltip.Root
        onOpenChange={newOpenState => !hide && setOpen(newOpenState)}
        open={open}
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
              className='z-[10000] max-w-[300px] rounded-lg bg-black px-3 py-1 text-center text-sm font-semibold text-white [transform-origin:var(--radix-tooltip-content-transform-origin)] dark:bg-white dark:text-black sm:max-w-[unset]'
              sideOffset={sideOffset || 5}
              side={side || 'top'}
            >
              {content}
              <RadixTooltip.Arrow className='fill-black dark:fill-white'/>
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        )}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}