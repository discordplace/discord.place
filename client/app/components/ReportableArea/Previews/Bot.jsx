import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { t } from '@/stores/language';

export default function BotPreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className="flex items-center gap-x-2">
        <UserAvatar
          id={metadata.id}
          hash={metadata.avatar}
          size={64}
          width={40}
          height={40}
          className="rounded-lg"
        />

        <h2 className="text-sm font-semibold text-secondary">
          {metadata.username}#{metadata.discriminator}
        </h2>
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.labels.shortDescription')}
        </h2>

        <p className='text-xs font-medium whitespace-pre-wrap text-tertiary line-clamp-2'>
          {metadata.short_description}
        </p>
      </div>
    </div>
  );
}