import useGeneralStore from '@/stores/general';
import ProfilePreview from '@/app/components/ReportableArea/Previews/Profile';
import ServerPreview from '@/app/components/ReportableArea/Previews/Server';
import BotPreview from '@/app/components/ReportableArea/Previews/Bot';
import EmojiPreview from '@/app/components/ReportableArea/Previews/Emoji';
import TemplatePreview from '@/app/components/ReportableArea/Previews/Template';
import SoundPreview from '@/app/components/ReportableArea/Previews/Sound';
import ReviewPreview from '@/app/components/ReportableArea/Previews/Review';
import ThemePreview from '@/app/components/ReportableArea/Previews/Theme';
import config from '@/config';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function ReportAreaModal({ type, metadata }) {
  const reason = useGeneralStore(state => state.reportAreaModal.reason);
  const setReason = useGeneralStore(state => state.reportAreaModal.setReason);

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='w-full p-4 border rounded-2xl bg-secondary border-primary h-max'>
        {type === 'profile' && <ProfilePreview metadata={metadata} />}
        {type === 'server' && <ServerPreview metadata={metadata} />}
        {type === 'bot' && <BotPreview metadata={metadata} />}
        {type === 'emoji' && <EmojiPreview metadata={metadata} />}
        {type === 'template' && <TemplatePreview metadata={metadata} />}
        {type === 'sound' && <SoundPreview metadata={metadata} />}
        {type === 'review' && <ReviewPreview metadata={metadata} />}
        {type === 'theme' && <ThemePreview metadata={metadata} />}
        {type === 'something' && <p className='text-sm text-tertiary'>{t('inAppReporting.reportModal.labels.something')}</p>}
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('inAppReporting.reportModal.inputs.reason.label')}
        </h2>

        <p className='text-xs text-tertiary'>
          {t('inAppReporting.reportModal.inputs.reason.description')}
        </p>
            
        <div className='relative'>
          <textarea
            className='bg-quaternary peer text-sm mt-2 font-medium placeholder-placeholder scrollbar-hide sm:text-base resize-none block w-full h-[100px] p-2 border-2 disabled:pointer-events-none disabled:opacity-80 [&:not(:disabled)]:cursor-text border-transparent rounded-lg outline-none text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
            value={reason}
            onChange={event => setReason(event.target.value)}
            maxLength={config.reportReasonMaxCharacters}
          />

          <span 
            className={cn(
              'absolute text-xs transition-opacity opacity-0 peer-focus-visible:opacity-100 -top-4 right-2 text-tertiary',
              reason.length > 0 && reason.length < config.reportReasonMinCharacters && 'text-red-400'
            )}
          >
            {reason.length}/{config.reportReasonMaxCharacters}
          </span>
        </div>
      </div>
    </div>
  );
}