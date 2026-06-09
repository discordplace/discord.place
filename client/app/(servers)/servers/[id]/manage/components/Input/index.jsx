'use client';

import cn from '@/lib/cn';

export default function Input({ label, customLabelPeer, description, type, CustomInput, className, ...props }) {
  const ignoreProps = ['label', 'customLabelPeer', 'description', 'type', 'CustomInput', 'className'];

  return (
    <div className='flex flex-1 flex-col gap-y-2'>
      <div className='flex size-full items-center gap-x-2'>
        <label
          className='font-medium text-secondary'
        >
          {label}
        </label>

        {customLabelPeer}
      </div>

      <p className='text-sm text-tertiary'>
        {description}
      </p>

      {CustomInput || (
        <>
          {type === 'paragraph' && (
            <textarea
              className={cn(
                'mt-2 h-[250px] w-full resize-none scrollbar-none rounded-xl border-2 border-[rgba(var(--bg-background))] bg-secondary p-4 text-tertiary caret-[rgba(var(--text-tertiary))] outline-hidden placeholder:text-placeholder focus:border-purple-500 focus-visible:text-primary disabled:pointer-events-none disabled:opacity-70',
                className
              )}
              value={props.value || ''}
              {...Object.keys(props).reduce((acc, key) => {
                if (!ignoreProps.includes(key)) acc[key] = props[key];

                return acc;
              }, {})}
            />
          )}

          {type !== 'paragraph' && (
            <input
              type='text'
              className={cn(
                'mt-2 w-full rounded-xl border-2 border-[rgba(var(--bg-background))] bg-secondary px-4 py-2 text-tertiary caret-[rgba(var(--text-tertiary))] outline-hidden placeholder:text-placeholder focus:border-purple-500 focus-visible:text-primary disabled:pointer-events-none disabled:opacity-70',
                className
              )}
              value={props.value || ''}
              {...Object.keys(props).reduce((acc, key) => {
                if (!ignoreProps.includes(key)) acc[key] = props[key];

                return acc;
              }, {})}
            />
          )}
        </>
      )}
    </div>
  );
}