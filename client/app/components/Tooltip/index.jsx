import * as RadixTooltip from '@radix-ui/react-tooltip';

export default function Tooltip({ children, content }) {
  return (
    <RadixTooltip.Provider delayDuration='0' skipDelayDuration='0'>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
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