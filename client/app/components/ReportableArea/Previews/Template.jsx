import getCompressedName from '@/lib/getCompressedName';
import { t } from '@/stores/language';

export default function TemplatePreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className="flex items-center gap-x-2">
        <div className="w-[64px] h-[64px] rounded-2xl font-bold bg-quaternary flex items-center justify-center text-xl">
          {getCompressedName(metadata.name, 4)}
        </div>

        <div className='flex flex-col gap-y-1'>
          <h2 className="text-sm font-semibold text-secondary">
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

        <p className='text-xs font-medium whitespace-pre-wrap text-tertiary line-clamp-2'>
          {metadata.description}
        </p>
      </div>
    </div>
  );
}