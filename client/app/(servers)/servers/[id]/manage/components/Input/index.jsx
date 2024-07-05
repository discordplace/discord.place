'use client';

import cn from '@/lib/cn';

export default function Input({ label, customLabelPeer, description, type, CustomInput, className, ...props }) {
  const ignoreProps = ['label', 'customLabelPeer', 'description', 'type', 'CustomInput', 'className'];

  return (
    <div className='flex flex-col flex-1 gap-y-2'>
      <div className="flex items-center w-full h-full gap-x-2">
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

      {CustomInput ? (
        CustomInput
      ) : (
        <>
          {type === 'paragraph' && (
            <textarea
              className={cn(
                'disabled:opacity-70 disabled:pointer-events-none scrollbar-hide mt-2 caret-[rgba(var(--text-tertiary))] w-full h-[250px] p-4 border-none resize-none placeholder-placeholder text-tertiary focus-visible:text-primary bg-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none',
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
                'disabled:opacity-70 disabled:pointer-events-none mt-2 caret-[rgba(var(--text-tertiary))] w-full px-4 py-2 border-none placeholder-placeholder text-tertiary focus-visible:text-primary bg-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none',
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