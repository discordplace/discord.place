import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import { t } from '@/stores/language';

export default function ProfilePreview({ metadata }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex gap-x-2'>
        <UserAvatar
          id={metadata.id}
          hash={metadata.avatar}
          size={64}
          width={40}
          height={40}
          className='rounded-full'
        />

        <div className='flex flex-col justify-center'>
          <h2 className='text-sm font-semibold text-secondary'>
            {metadata.global_name || metadata.username}{'\''}s Profile
          </h2>

          <p className='text-xs text-tertiary'>
            @{metadata.username}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.labels.biography')}
        </h2>

        <p className='line-clamp-2 whitespace-pre-wrap text-xs font-medium text-tertiary'>
          {metadata.bio === 'No bio provided.' ? t('profileCard.noBio') : metadata.bio}
        </p>
      </div>
    </div>
  );
}