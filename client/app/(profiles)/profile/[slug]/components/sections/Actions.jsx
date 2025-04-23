'use client';import { IoMdHeart, IoMdHeartEmpty, BsPencil, BsPencilFill } from '@/icons';
import { toast } from 'sonner';
import likeProfile from '@/lib/request/profiles/likeProfile';
import cn from '@/lib/cn';
import { useState } from 'react';import config from '@/config';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Tooltip from '@/app/components/Tooltip';
import useAuthStore from '@/stores/auth';
import CopyButton from '@/app/components/CopyButton';
import revalidateProfile from '@/lib/revalidate/profile';
import { t } from '@/stores/language';

export default function Actions({ profile }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(profile.isLiked);

  const handleLike = () => {
    if (!loggedIn) return toast.error(t('profilePage.actions.toast.loginRequiredForLike'));

    setLoading(true);

    toast.promise(likeProfile(profile.slug), {
      loading: t(`profilePage.actions.toast.${liked ? 'unliking' : 'liking'}`, { profileSlug: profile.slug }),
      success: isLiked => {
        setLiked(isLiked);
        setLoading(false);
        revalidateProfile(profile.slug);

        return t(`profilePage.actions.toast.${isLiked ? 'liked' : 'unliked'}`, { profileSlug: profile.slug });
      },
      error: error => {
        setLoading(false);

        return `Error: ${error}`;
      }
    });
  };

  return (
    <motion.div
      className='absolute bottom-4 right-4 z-[4] flex w-full justify-end'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
    >
      <div className='flex flex-col gap-2 sm:flex-row'>
        <Tooltip
          content={loggedIn ? (liked ? t('profilePage.actions.tooltip.unlikeProfile') : t('profilePage.actions.tooltip.likeProfile')) : t('profilePage.actions.tooltip.loginRequiredForLike')}
        >
          <button className='group rounded-lg bg-tertiary p-2.5 text-secondary hover:bg-quaternary hover:text-primary' onClick={handleLike} disabled={loading}>
            <IoMdHeartEmpty
              className={cn(
                'absolute transition-[transform,colors]',
                liked ? 'opacity-0' : 'opacity-100 group-hover:opacity-0 group-hover:text-red-500 group-hover:scale-[1.2]'
              )}
            />

            <IoMdHeart
              className={cn(
                'transition-[transform,colors]',
                liked ? 'opacity-100 group-hover:scale-[1.2] text-red-500' : 'opacity-0 group-hover:opacity-100 group-hover:scale-[1.2] group-hover:text-red-500'
              )}
            />
          </button>
        </Tooltip>

        <Tooltip content={t('profilePage.actions.tooltip.copyProfileUrl')}>
          <div className='flex'>
            <CopyButton
              className='bg-tertiary'
              successText={t('profilePage.actions.toast.profileUrlCopied')}
              copyText={config.getProfileURL(profile.slug, profile.preferredHost)}
            />
          </div>
        </Tooltip>

        {profile.permissions.canEdit && (
          <Tooltip content={t('profilePage.actions.tooltip.editProfile')}>
            <Link className='group rounded-lg bg-tertiary p-2.5 text-secondary hover:bg-quaternary hover:text-primary' href={`/profile/${profile.slug}/edit`}>
              <BsPencil className='absolute opacity-100 transition-[transform,colors] group-hover:scale-[1.2] group-hover:opacity-0' />
              <BsPencilFill className='opacity-0 group-hover:scale-[1.2] group-hover:opacity-100' />
            </Link>
          </Tooltip>
        )}
      </div>
    </motion.div>
  );
}