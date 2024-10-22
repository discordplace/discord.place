import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import { t } from '@/stores/language';

export default function ServerPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center gap-x-2'>
        <ServerIcon
          className='rounded-lg'
          hash={metadata.icon}
          height={40}
          id={metadata.id}
          size={64}
          width={40}
        />

        <h2 className='text-sm font-semibold text-secondary'>
          {metadata.name}
        </h2>
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