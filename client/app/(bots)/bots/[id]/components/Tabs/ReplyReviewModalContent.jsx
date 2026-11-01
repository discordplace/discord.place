'use client';

import { useTranslation } from 'react-i18next';

import ReviewPreview from '@/app/components/ReportableArea/Previews/Review';
import config from '@/config';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';

export default function ReplyReviewModalContent({ review }) {
  const { t } = useTranslation();
  const replyContent = useGeneralStore(state => state.replyReviewModal.replyContent);
  const setReplyContent = useGeneralStore(state => state.replyReviewModal.setReplyContent);

  const metadata = {
    content: review.content,
    rating: review.rating,
    reviewer: {
      avatar: review.user.avatar,
      id: review.user.id,
      username: review.user.username
    }
  };

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='h-max w-full rounded-2xl border border-primary bg-secondary p-4'>
        <ReviewPreview metadata={metadata} />
      </div>

      <div className='flex flex-col gap-y-1'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('botPage.tabs.reviews.replyModal.inputs.reply.label')}
        </h2>

        <p className='text-xs text-tertiary'>
          {t('botPage.tabs.reviews.replyModal.inputs.reply.description')}
        </p>

        <div className='relative mt-5'>
          <textarea
            className='peer mt-2 block h-[100px] w-full resize-none scrollbar-none rounded-lg border-2 border-transparent bg-quaternary p-2 text-sm font-medium text-placeholder outline-hidden not-disabled:cursor-text placeholder:text-placeholder focus-visible:border-purple-500 focus-visible:text-primary disabled:pointer-events-none disabled:opacity-80 sm:text-base'
            value={replyContent}
            onChange={event => setReplyContent(event.target.value)}
            maxLength={config.reviewReplyMaxCharacters}
          />

          <span
            className={cn(
              'absolute -top-4 right-2 text-xs text-tertiary opacity-0 transition-opacity peer-focus-visible:opacity-100',
              replyContent.length > 0 && replyContent.length < config.reviewReplyMinCharacters && 'text-red-400'
            )}
          >
            {replyContent.length}/{config.reviewReplyMaxCharacters}
          </span>
        </div>
      </div>
    </div>
  );
}
