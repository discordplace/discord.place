'use client';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { toast } from 'sonner';
import likeProfile from '@/lib/request/profiles/likeProfile';
import cn from '@/lib/cn';
import { useState } from 'react';
import { BsPencil, BsPencilFill } from 'react-icons/bs';
import config from '@/config';
import { AiOutlineFlag, AiFillFlag} from 'react-icons/ai';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Tooltip from '@/app/components/Tooltip';
import useAuthStore from '@/stores/auth';
import CopyButton from '@/app/components/CopyButton';
import revalidateProfile from '@/lib/revalidate/profile';

export default function Actions({ profile }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(profile.isLiked);

  const handleLike = () => {
    if (!loggedIn) return toast.error('You must be logged in to like profiles!');

    setLoading(true);

    toast.promise(likeProfile(profile.slug), {
      loading: liked ? `Unliking ${profile.slug}...` : `Liking ${profile.slug}...`,
      success: (isLiked) => {
        setLiked(isLiked);
        setLoading(false);
        revalidateProfile(profile.slug);

        return isLiked ? `Liked ${profile.slug}!` : `Unliked ${profile.slug}!`;
      },
      error: error => {
        setLoading(false);
        return `Error: ${error}`;
      }
    });
  };

  return (
    <motion.div 
      className='absolute flex justify-end w-full bottom-4 right-4 z-[4]' 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
    >
      <div className='flex flex-col gap-2 sm:flex-row'>
        <Tooltip content={loggedIn ? (liked ? 'Unlike' : 'Like') : 'You must be logged in to like profiles!'}>
          <button className='text-secondary hover:text-primary p-2.5 bg-tertiary hover:bg-quaternary rounded-lg group' onClick={handleLike} disabled={loading}>
            <IoMdHeartEmpty className={cn(
              'absolute transition-[transform,colors]',
              liked ? 'opacity-0' : 'opacity-100 group-hover:opacity-0 group-hover:text-red-500 group-hover:scale-[1.2]'
            )} />
            <IoMdHeart className={cn(
              'transition-[transform,colors]',
              liked ? 'opacity-100 group-hover:scale-[1.2] text-red-500' : 'opacity-0 group-hover:opacity-100 group-hover:scale-[1.2] group-hover:text-red-500'
            )} />
          </button>
        </Tooltip>

        <Tooltip content='Copy Profile URL'>
          <div className='flex'>
            <CopyButton className='bg-tertiary' successText='Profile URL copied to clipboard!' copyText={config.getProfileURL(profile.slug, profile.preferredHost)} />
          </div>
        </Tooltip>

        <Tooltip content='Report Profile'>
          <Link className='text-secondary hover:text-primary p-2.5 bg-tertiary hover:bg-quaternary rounded-lg group' href={config.supportInviteUrl} target='_blank'>
            <AiOutlineFlag className='absolute transition-[transform,colors] opacity-100 group-hover:opacity-0 group-hover:text-red-500 group-hover:scale-[1.2]' />
            <AiFillFlag className='opacity-0 group-hover:opacity-100 group-hover:scale-[1.2] group-hover:text-red-500' />
          </Link>
        </Tooltip>

        {profile.permissions.canEdit && (
          <Tooltip content='Edit Profile'>
            <Link className='text-secondary hover:text-primary p-2.5 bg-tertiary hover:bg-quaternary rounded-lg group' href={`/profile/${profile.slug}/edit`}>
              <BsPencil className='absolute transition-[transform,colors] opacity-100 group-hover:opacity-0 group-hover:scale-[1.2]' />
              <BsPencilFill className='opacity-0 group-hover:opacity-100 group-hover:scale-[1.2]' />
            </Link>
          </Tooltip>
        )}
      </div>
    </motion.div>
  );
}