import { PiWaveformBold } from '@/icons';

export default function SoundPreview({ metadata }) {
  return (
    <div className='flex items-center gap-x-2'>
      <PiWaveformBold className='size-8 text-tertiary' />

      <div className='flex flex-col gap-y-1'>
        <div className='flex items-center gap-x-2'>
          <h2 className='text-sm font-semibold text-secondary'>
            {metadata.name}
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