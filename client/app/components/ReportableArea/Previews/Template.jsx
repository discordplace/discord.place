import getCompressedName from '@/lib/getCompressedName';
import { t } from '@/stores/language';

export default function TemplatePreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center gap-x-2'>
        <div className='flex size-[64px] items-center justify-center rounded-2xl bg-quaternary text-xl font-bold'>
          {getCompressedName(metadata.name, 4)}
        </div>

        <div className='flex flex-col gap-y-1'>
          <h2 className='text-sm font-semibold text-secondary'>
            {metadata.name}
          </h2>

          <span className='text-xs font-medium text-tertiary'>
            {metadata.id}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.labels.description')}
        </h2>

        <p className='line-clamp-2 whitespace-pre-wrap text-xs font-medium text-tertiary'>
          {metadata.description}
        </p>
      </div>
    </div>
  );
}