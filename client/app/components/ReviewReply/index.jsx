'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCrown } from 'react-icons/fa';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import getRelativeTime from '@/lib/getRelativeTime';
import getHashes from '@/lib/request/general/getHashes';
import useAuthStore from '@/stores/auth';

export default function ReviewReply({ page = 'server', reply }) {
  const { t, i18n } = useTranslation();
  const user = useAuthStore(state => state.user);
  const translationPrefix = page === 'bot' ? 'botPage.tabs.reviews' : 'serverPage.tabs.reviews';
  const [replyAvatar, setReplyAvatar] = useState(reply.user.avatar || (reply.user.id === user?.id ? user.avatar : undefined));

  useEffect(() => {
    if (reply.user.avatar) {
      setReplyAvatar(reply.user.avatar);

      return;
    }

    if (reply.user.id === user?.id && user.avatar) {
      setReplyAvatar(user.avatar);

      return;
    }

    let cancelled = false;

    getHashes(reply.user.id)
      .then(hashes => {
        if (!cancelled) setReplyAvatar(hashes.avatar);
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, [reply.user.avatar, reply.user.id, user?.avatar, user?.id]);

  return (
    <div className={cn(
      'mt-3 flex flex-col gap-y-1',
      !reply.approved && 'opacity-60'
    )}>
      <div className='flex items-center gap-x-2'>
        <UserAvatar
          id={reply.user.id}
          hash={replyAvatar}
          size={64}
          width={24}
          height={24}
          className='size-[24px] rounded-full'
        />

        <div className='flex items-center gap-x-1 text-sm'>
          <span className='font-semibold text-primary'>
            {reply.user.username}
          </span>

          <Tooltip content={t(`${translationPrefix}.reply.owner`)}>
            <div>
              <FaCrown aria-label='Owner' className='text-yellow-500' />
            </div>
          </Tooltip>
        </div>

        <span className='text-xs text-tertiary'>
          {getRelativeTime(reply.created_at, i18n.language)}
        </span>
      </div>

      <p className='pl-8 text-sm font-medium wrap-break-word whitespace-pre-wrap text-secondary'>
        {reply.content}
      </p>

      {!reply.approved && (
        <p className='mt-1 ml-8 text-[11px] font-medium text-tertiary'>
          {t(`${translationPrefix}.reply.pending`)}
        </p>
      )}
    </div>
  );
}
