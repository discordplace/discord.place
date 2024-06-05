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
          asChild
        >
          {children}
        </RadixTooltip.Trigger>
        {content && (
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              className={cn(
                'max-w-[200px] font-semibold [transform-origin:var(--radix-tooltip-content-transform-origin)] discord-theme bg-[#111214] px-4 py-1.5 rounded-lg',
                size === 'small' && 'text-xs px-2.5'
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