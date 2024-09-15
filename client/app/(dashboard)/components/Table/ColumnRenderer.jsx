'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import Image from 'next/image';
import getRelativeTime from '@/lib/getRelativeTime';
import getCompressedName from '@/lib/getCompressedName';
import useGeneralStore from '@/stores/general';
import { FaPause, FaStar } from 'react-icons/fa';
import { HiPlay } from 'react-icons/hi2';
import { useEffect, useRef } from 'react';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import cn from '@/lib/cn';
import Countdown from '@/app/components/Countdown';
import useDashboardStore from '@/stores/dashboard';
import { FiArrowRightCircle } from 'react-icons/fi';

function CategoryBadge({ children, icons }) {
  return (
    <div className='text-xs flex border border-primary items-center gap-x-2 font-medium px-1.5 py-0.5 bg-secondary text-white rounded-lg'>
      <span className='text-tertiary'>
        {icons[children]}
      </span>

      {children}
    </div>
  );
}

export default function ColumnRenderer({ data }) {
  const currentlyPlaying = useGeneralStore(state => state.sounds.currentlyPlaying);
  const setCurrentlyPlaying = useGeneralStore(state => state.sounds.setCurrentlyPlaying);

  const onPlayPause = () => {
    if (currentlyPlaying === data.id) setCurrentlyPlaying('');
    else setCurrentlyPlaying(data.id);
  };

  const audioRef = useRef(null);

  useEffect(() => {
    if (!data || data.type !== 'sound') return;

    function handleEnded() {
      setCurrentlyPlaying('');
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleEnded);
    }

    audioRef.current = new Audio(config.getSoundURL(data.id));

    if (currentlyPlaying === data.id) {
      audioRef.current.play();
      audioRef.current.addEventListener('ended', handleEnded);
    } else audioRef.current.pause();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyPlaying]);

  const dashboardData = useDashboardStore(state => state.data);

  switch (data?.type) {
    case 'emoji':
      return (
        <div className='flex items-center gap-x-2'>
          <Image
            src={config.getEmojiURL(data.id, data.animated)}
            width={32}
            height={32}
            alt={`Emoji ${data.id}`}
            className='pointer-events-none object-contain w-[32px] h-[32px]'
          />
          
          <span className='font-medium'>
            {data.name}
          </span> 
        </div>
      );
    case 'emojiPack':
      return (
        <div className='flex items-center gap-x-2'>
          <div className='flex'>
            {data.emoji_ids.map(packedEmoji => (
              <Image
                key={packedEmoji.id}
                src={config.getEmojiURL(`packages/${data.id}/${packedEmoji.id}`, packedEmoji.animated)} 
                alt={`Emoji ${data.name}`}
                width={32}
                height={32}
                className='pointer-events-none object-contain w-[32px] h-[32px]'
              />
            ))}
          </div>
          
          <span className='font-medium'>
            {data.name}
          </span> 
        </div>
      );
    case 'user':
      return (
        <div className='flex items-center gap-x-2 pl-1 pr-2 rounded-full w-max py-0.5 bg-quaternary'>
          <UserAvatar
            id={data.id}
            hash={data.avatar}
            size={32}
            width={16}
            height={16}
            className='rounded-full'
          />

          <span className='text-sm font-medium text-primary'>
            {data.username || 'Unknown'}
          </span>

          {data.showId && (
            <span className='text-xs text-tertiary'>
              {data.id}
            </span>
          )}
        </div>
      );
    case 'server':
      return (
        <div className='flex items-center gap-x-2 pl-1 pr-2 rounded-full w-max py-0.5 bg-quaternary'>
          <ServerIcon
            id={data.id}
            hash={data.icon}
            size={32}
            width={16}
            height={16}
            className='rounded-full'
          />

          <span className='text-sm font-medium text-primary'>
            {data.name || 'Unknown'}
          </span>
        </div>
      );
    case 'bot':
      return (
        <div className='flex items-center gap-x-2 pl-1 pr-2 rounded-full w-max py-0.5 bg-quaternary'>
          <UserAvatar
            id={data.id}
            hash={data.avatar}
            size={32}
            width={16}
            height={16}
            className='rounded-full'
          />

          <div className='text-sm font-medium text-primary'>
            {data.username || 'Unknown'}

            <span className='text-xs text-tertiary'>
              #{data.discriminator}
            </span>
          </div>
        </div>
      );
    case 'category':
      return (
        <div className='flex items-center gap-x-2'>
          {Array.isArray(data.value) ? data.value.slice(0, 5).map(category => (
            <CategoryBadge
              key={category}
              icons={data.icons}
            >
              {category}
            </CategoryBadge>
          )) : (
            <CategoryBadge icons={data.icons}>
              {data.value}
            </CategoryBadge>
          )}

          {Array.isArray(data.value) && data.value.length > 5 && (
            <span className='text-xs font-medium text-tertiary'>
              {data.value.length - 5} more
            </span>
          )}
        </div>
      );
    case 'date':
      var date = new Date(data.value);
      var now = new Date();

      var yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1); 

      return (
        <span>
          {date > yesterday ? getRelativeTime(data.value, 'en') : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      );
    case 'long-text':
      return (
        <div className='flex items-center gap-x-2'>
          <div className='text-xs font-medium overflow-hidden max-w-[200px] text-tertiary line-clamp-2'>
            {data.value}
          </div>
        </div>
      );
    case 'text':
      return (
        <span className='text-sm font-medium'>
          {data.value}
        </span>
      );
    case 'template':
      return (
        <div className='flex items-center gap-x-2'>
          <div className='w-[32px] h-[32px] rounded-md bg-quaternary flex items-center justify-center font-bold'>
            {getCompressedName(data.name)}
          </div>
          
          <span className='font-medium'>
            {data.name}
          </span>
        </div>
      );
    case 'sound':
      return (
        <div className='flex items-center ml-2 gap-x-2'>
          <button
            className='outline-none text-[rgba(var(--bg-secondary))] bg-black hover:bg-black/70 dark:bg-white dark:hover:bg-white/70 w-[24px] h-[24px] items-center flex justify-center rounded-full'
            onClick={onPlayPause}
          >
            {currentlyPlaying === data.id ? (
              <FaPause size={10} />
            ) : (
              <HiPlay className='relative left-[1px]' />
            )}
          </button>

          <h2 className='text-sm font-medium'>
            {data.name}
          </h2>
        </div>
      );
    case 'rating':
      return (
        <div className='flex items-center gap-x-2'>
          <h2 className='flex items-center text-lg font-semibold'>
            {data.value}

            <span className='text-xs text-tertiary'>
              /5
            </span>
          </h2>

          <div className='flex items-center gap-x-1'>
            {new Array(5).fill(null).map((_, index) => (
              <FaStar
                key={index}
                size={12}
                className={cn(
                  index < data.value ? 'text-yellow-500' : 'text-tertiary'
                )}
              />
            ))}
          </div>
        </div>
      );
    case 'ipAddress':
      return (
        <span className='rounded-full bg-quaternary font-medium text-xs text-primary px-2 py-0.5'>
          {data.value}
        </span>
      );
    case 'link':
      return (
        <div className='flex flex-col ml-2 gap-y-1'>
          <span className='text-xs font-medium text-tertiary'>
            dsc.ink/<span className='text-sm text-primary'>{data.name}</span>
          </span>

          <span className='text-xs font-medium text-secondary'>
            {data.redirectTo}
          </span>
        </div>
      );
    case 'number':
      var formatter = new Intl.NumberFormat('en-US', { style: 'decimal', notation: 'compact', maximumFractionDigits: 2 });

      return (
        <span className='font-semibold text-xs text-primary px-2 py-1.5 rounded-full border border-primary bg-secondary'>
          {formatter.format(data.value)}
        </span>
      );
    case 'reason':
      return (
        <div className='flex flex-col gap-y-1'>
          <h2 className='text-sm font-medium'>
            {data.value.title}
          </h2>

          <div className='text-xs font-medium overflow-hidden max-w-[200px] text-tertiary line-clamp-2'>
            {data.value.description}
          </div>
        </div>
      );
    case 'countdown':
      return (
        <div className='text-xs font-medium text-tertiary'>
          {data.value ? (
            <Countdown
              date={data.value}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) return 'Ended';

                return `${days} days ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
              }}
            />
          ) : (
            'N/A'
          )}
        </div>
      );
    case 'restriction':
      return (
        <span className='px-2 py-1 text-xs font-medium border rounded-full text-secondary bg-secondary border-primary'>
          {data.value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
        </span>
      );
    case 'email':
      return (
        <span className='px-2 py-1 text-xs font-medium border rounded-full text-secondary bg-secondary border-primary'>
          {data.value}
        </span>
      );
    case 'userSubscription':
      var foundPlan = dashboardData?.plans?.find(plan => plan.id === data.value?.planId);

      if (!foundPlan) return (
        <span className='text-xs font-medium text-tertiary'>
          Unknown Plan
        </span>
      );

      return (
        <div className='flex flex-col gap-y-1'>
          <h2 className='text-sm font-semibold'>
            {foundPlan.name}
          </h2>

          <div className='flex items-center text-xs gap-x-1 text-secondary'>
            <FiArrowRightCircle
              size={16}
              className='text-green-500 -rotate-45'
            />

            {new Date(data.value.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            
            <span className='text-tertiary'>
              ({getRelativeTime(data.value.createdAt, 'en')})
            </span>
          </div>
        </div>
      );
    default:
      return JSON.stringify(data);
  }
}