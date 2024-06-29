'use client';

export default function Input({ label, description, type, CustomInput, ...props }) {
  return (
    <div className='flex flex-col flex-1 gap-y-2'>
      <label
        className='font-medium text-secondary'
      >
        {label}
      </label>

      <p className='text-sm text-tertiary'>
        {description}
      </p>

      {CustomInput ? (
        CustomInput
      ) : (
        <>
          {type === 'paragraph' && (
            <textarea
              className='scrollbar-hide mt-2 caret-[rgba(var(--text-tertiary))] w-full h-[250px] p-4 border-none resize-none placeholder-placeholder text-tertiary focus-visible:text-primary bg-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none'
              value={props.value || ''}
              {...Object.keys(props).reduce((acc, key) => {
                if (key !== 'value') acc[key] = props[key];
                return acc;
              }, {})}
            />
          )}

          {type !== 'paragraph' && (
            <input
              type='text'
              className='mt-2 caret-[rgba(var(--text-tertiary))] w-full px-4 py-2 border-none placeholder-placeholder text-tertiary focus-visible:text-primary bg-secondary rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none'
              value={props.value || ''}
              {...Object.keys(props).reduce((acc, key) => {
                if (key !== 'value') acc[key] = props[key];
                return acc;
              }, {})}
            />
          )}
        </>
      )}
    </div>
  );
}