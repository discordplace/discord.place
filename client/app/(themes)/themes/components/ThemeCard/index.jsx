'use client';

import { colord } from 'colord';
import cn from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '@/stores/auth';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import { t } from '@/stores/language';
import Twemoji from 'react-twemoji';
import { useMemo } from 'react';
import AddFriendIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/AddFriend';
import MoreIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/More';

export default function ThemeCard({ id, primaryColor, secondaryColor }) {
  const isLight = colord(primaryColor).isLight();
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);

  const Container = id ? Link : 'div';

  const backgroundColor = isLight ? '#ffffff26' : '#00000026';
  const profileGradientOverlayColor = isLight ? '#ffffff99' : '#00000099';
  const borderColor = `${colord(primaryColor).invert().alpha(0.12).toHex()}`;

  const mutualFriendsCount = useMemo(() => Math.floor(Math.random() * 7) + 3, []);
  const mutualServersCount = useMemo(() => Math.floor(Math.random() * 7) + 3, []);
  const avatars = useMemo(() => {
    const avatars = new Array(3).fill(null).map(() => `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`);

    return avatars;
  }, []);

  const randomStatus = useMemo(() => {
    const statuses = ['online', 'idle', 'dnd', 'offline'];

    return statuses[Math.floor(Math.random() * statuses.length)];
  }, []);

  const randomEmoji = useMemo(() => {
    const emojis = ['👋', '👀', '😎', '🤔', '😏', '😜', '😇', '😈', '🤖', '👻'];

    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  const roles = [
    { name: t('themeCard.roles.0.name'), color: '#faa61a' },
    { name: t('themeCard.roles.1.name'), color: '#3ba55c' },
    { name: t('themeCard.roles.2.name') },
    { name: t('themeCard.roles.3.name') },
    { name: t('themeCard.roles.4.name'), color: '#eb459f' }
  ];

  return (
    <Container
      className={cn(
        'rounded-xl p-1 font-ggSans transition-all w-full',
        id ? 'hover:opacity-80' : 'pointer-events-none select-none'
      )}
      href={`/themes/${id}`}
      style={{
        background: `linear-gradient(${primaryColor}, ${secondaryColor})`,
        color: isLight ? 'rgba(var(--light-text-primary))' : 'rgba(var(--dark-text-primary))'
      }}
    >
      <div
        className='relative flex w-full flex-col rounded-lg bg-secondary pb-4'
        style={{
          '--profile-gradient-start': `color-mix(in oklab, ${profileGradientOverlayColor} 100%, ${primaryColor})`,
          '--profile-gradient-end': `color-mix(in oklab, ${profileGradientOverlayColor} 100%, ${secondaryColor})`,
          background: 'linear-gradient(var(--profile-gradient-start), var(--profile-gradient-start) 100%, var(--profile-gradient-end))'
        }}
      >
        <div className='absolute right-4 top-4'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center justify-center rounded-full bg-black/50 p-2 text-white'>
              <AddFriendIcon className='size-4' />
            </div>

            <div className='flex items-center justify-center rounded-full bg-black/50 p-2 text-white'>
              <MoreIcon className='size-4' />
            </div>
          </div>
        </div>

        {(loggedIn && user?.banner) ? (
          <UserBanner
            id={user.id}
            hash={user.banner}
            size={512}
            width={325}
            height={125}
            className='absolute left-0 top-0 h-[125px] w-full rounded-t-lg object-cover'
            style={{
              maskImage: 'radial-gradient(circle at 64px 122px, transparent 45px, black 46px)',
              WebkitMaskImage: 'radial-gradient(circle at 64px 122px, transparent 45px, black 46px)'
            }}
          />
        ) : (
          <div
            className='absolute left-0 top-0 h-[105px] w-full'
            style={{
              maskImage: 'radial-gradient(circle at 64px 122px, transparent 45px, black 46px)',
              WebkitMaskImage: 'radial-gradient(circle at 64px 122px, transparent 45px, black 46px)'
            }}
          />
        )}

        <div
          className={cn(
            'relative ml-[25px] size-[78px] translate-y-[-40px]',
            (loggedIn && user?.banner) ? 'mt-[125px]' : 'mt-[105px]'
          )}
        >
          <Image
            src={`/status/${randomStatus}.svg`}
            alt={`${randomStatus} Status Badge`}
            width={18}
            height={18}
            className='absolute bottom-[2px] right-[2px] rounded-full'
          />

          {(loggedIn && user?.avatar) ? (
            <UserAvatar
              id={user.id}
              hash={user.avatar}
              size={128}
              width={78}
              height={78}
              className='rounded-full [mask-image:radial-gradient(circle_at_85%_85%,_transparent_10px,_black_10.2px)]'
            />
          ) : (
            <Image
              src='/default-discord-avatar.png'
              alt='Profile Picture'
              width={78}
              height={78}
              className='rounded-full [mask-image:radial-gradient(circle_at_85%_85%,_transparent_10px,_black_10.2px)]'
            />
          )}
        </div>

        <div className='-mt-7 flex flex-col px-[20px]'>
          <h1 className='text-lg font-bold'>
            {user?.global_name || 'Discord'}
          </h1>

          <div className='flex items-center gap-x-2'>
            <h2 className='font-normal opacity-80'>
              {user?.username || 'discord'}
            </h2>

            {user?.flags.length > 0 && (
              <div
                className='flex items-center gap-1 rounded border px-1 py-0.5'
                style={{
                  background: backgroundColor,
                  borderColor
                }}
              >
                {user.flags.map((flag, index) => (
                  <Image
                    key={`theme-card-${id}-badge-${index}`}
                    src={`/user-flags/${flag}.svg`}
                    alt={`${flag} Flag`}
                    width={16}
                    height={16}
                    className='size-[16px]'
                  />
                ))}
              </div>
            )}
          </div>

          <div className='mt-2 flex items-center'>
            <div className='flex items-center gap-x-1 text-xs'>
              <div className='flex -space-x-1'>
                <Image
                  className='relative z-[1] size-4 rounded-full'
                  src={avatars[0]}
                  width={16}
                  height={16}
                  alt='Avatar'
                  style={{
                    background: borderColor,
                    maskImage: 'radial-gradient(circle at 124% 50%, transparent 10px, black 10.2px)'
                  }}
                />

                <Image
                  className='relative z-[1] size-4 rounded-full'
                  src={avatars[1]}
                  width={16}
                  height={16}
                  alt='Avatar'
                  style={{
                    background: borderColor,
                    maskImage: 'radial-gradient(circle at 124% 50%, transparent 10px, black 10.2px)'
                  }}
                />

                <Image
                  className='relative z-[1] size-4 rounded-full'
                  src={avatars[2]}
                  width={16}
                  height={16}
                  alt='Avatar'
                  style={{
                    background: borderColor
                  }}
                />
              </div>

              <span className='opacity-80'>
                {t('themeCard.mutualFriendsCount', { count: mutualFriendsCount })}
              </span>
            </div>

            <div className='mx-1.5 text-lg opacity-80'>
              •
            </div>

            <span className='text-xs opacity-80'>
              {t('themeCard.mutualServersCount', { count: mutualServersCount })}
            </span>
          </div>

          <p className='mt-2 text-sm'>
            {t('themeCard.quote')}
          </p>

          <div className='mt-3 flex flex-wrap gap-1.5'>
            {roles.map((role, index) => (
              <div
                key={`theme-card-${id}-role-${index}`}
                className='flex items-center gap-x-1.5 rounded-md border px-1.5 py-1 text-xs font-medium'
                style={{
                  background: backgroundColor,
                  borderColor
                }}
              >
                <div
                  className='size-[12px] rounded-full'
                  style={{
                    background: role.color || '#adadad'
                  }}
                />
                {role.name}
              </div>
            ))}
          </div>

          <div
            className='mt-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm'
            style={{
              background: backgroundColor,
              borderColor
            }}
          >
            <span className='opacity-70'>
              {t('themeCard.messageInputPlaceholder', { username: user?.username || 'discord' })}
            </span>

            <span>
              <Twemoji
                options={{ className: 'size-4' }}
                className={cn(
                  'opacity-70 grayscale',
                  isLight ? 'invert' : 'invert-0'
                )}
              >
                {randomEmoji}
              </Twemoji>
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
}