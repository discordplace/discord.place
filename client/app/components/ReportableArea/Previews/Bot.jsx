import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { t } from '@/stores/language';

export default function BotPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center gap-x-2'>
        <UserAvatar
          className='rounded-lg'
          hash={metadata.avatar}
          height={40}
          id={metadata.id}
          size={64}
          width={40}
        />

        <h2 className='text-sm font-semibold text-secondary'>
          {metadata.username}#{metadata.discriminator}
        </h2>
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.labels.shortDescription')}
        </h2>

        <p className='line-clamp-2 whitespace-pre-wrap text-xs font-medium text-tertiary'>
          {metadata.short_description}
        </p>
      </div>
    </div>
  );
}