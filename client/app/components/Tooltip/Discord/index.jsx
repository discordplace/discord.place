'use client';

import cn from '@/lib/cn';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tooltip({ children, content, side, sideOffset, size, hide }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <RadixTooltip.Provider
      delayDuration='0'
      skipDelayDuration='0'
      disableHoverableContent={true}
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
          asChild={true}
        >
          {children}
        </RadixTooltip.Trigger>
        {content && (
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              className={cn(
                // oxlint-disable-next-line tailwindcss/no-unknown-classes
                'discord-theme max-w-[200px] origin-(--radix-tooltip-content-transform-origin) rounded-lg bg-[#111214] px-4 py-1.5 font-semibold',
                size === 'small' && 'px-2.5 text-xs'
              )}
              sideOffset={sideOffset || 18}
              side={side || 'top'}
            >
              {content}
              <RadixTooltip.Arrow className='fill-[#111214]' />
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        )}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}