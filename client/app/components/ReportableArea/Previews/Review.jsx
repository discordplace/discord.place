import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { t } from '@/stores/language';
import { TiStarFullOutline } from 'react-icons/ti';

export default function ReviewPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center gap-x-3'>
        <UserAvatar
          className='rounded-lg'
          hash={metadata.reviewer.avatar}
          height={40}
          id={metadata.reviewer.id}
          size={64}
          width={40}
        />

        <div className='flex flex-col gap-y-2'>
          <h2 className='text-sm font-semibold text-primary'>
            @{metadata.reviewer.username}
          </h2>

          <div className='flex items-center text-xs font-semibold text-tertiary'>
            <span className='text-sm text-primary'>{metadata.rating}</span>/5 <TiStarFullOutline className='ml-2 text-sm text-yellow-500' />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.labels.review')}
        </h2>

        <p className='overflow-hidden whitespace-pre-wrap break-words text-xs font-medium text-tertiary'>
          {metadata.content}
        </p>
      </div>
    </div>
  );
}