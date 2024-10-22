export default function SoundPreview({ metadata }) {
  return (
    <div className="flex items-center gap-x-2">
      <div className="relative flex items-center justify-center">
        <span
          className='block size-8 rounded-full'
          style={{ backgroundColor: metadata.colors.primary }}
        />

        <span
          className='absolute block size-8 rounded-full'
          style={{
            backgroundColor: metadata.colors.secondary,
            clipPath: 'polygon(100% 0, 100% 48%, 100% 100%, 0 100%)'
          }}
        />
      </div>

      <div className='flex flex-col gap-y-1'>
        <div className='flex items-center gap-x-2'>
          <h2 className="text-sm font-semibold text-secondary">
            Theme
          </h2>

          <span className='text-xs font-medium text-tertiary'>
            {metadata.id}
          </span>
        </div>

        <p className='text-xs font-medium text-tertiary'>
          @{metadata.publisher.username}
        </p>
      </div>
    </div>
  );
}