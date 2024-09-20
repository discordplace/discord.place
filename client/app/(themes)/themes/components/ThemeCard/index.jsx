'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import useAuthStore from '@/stores/auth';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import a11yPlugin from 'colord/plugins/a11y';
import cn from '@/lib/cn';
import Link from 'next/link';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import { useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import getAverageColor from '@/app/(themes)/themes/components/ThemeCard/getAverageColor';

extend([
  mixPlugin,
  a11yPlugin
]);

export default function ThemeCard({ id, primaryColor, secondaryColor, className }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const user = useAuthStore(state => state.user);

  const badges = loggedIn ?
    user.flags.map(flag => `/user-flags/${flag}.svg`) :
    [
      '/user-flags/HypeSquadOnlineHouse1.svg',
      '/user-flags/BugHunterLevel1.svg',
      '/user-flags/ActiveDeveloper.svg'
    ];

  const averageColor = colord(primaryColor).mix(colord(secondaryColor)).toHex();
  const contrast = colord(averageColor).contrast();
  const contrastColor = contrast > 1.5 ? 'dark' : 'light';
  
  const [avatarAverageColor, setAvatarAverageColor] = useState(null);

  useLayoutEffect(() => {
    if (loggedIn && !user?.banner) {
      const image = document.querySelector(`img[alt="Image ${user.avatar}"]`);
      if (!image) return;
      
      if (image) getAverageColor(image)
        .then(setAvatarAverageColor)
        .catch(console.error);
    } else setAvatarAverageColor('#757e8a');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, user]);

  const Container = id ? Link : 'div';

  return (
    <Container
      className={cn(
        'hover:opacity-80 transition-all rounded-lg select-none w-full h-[200px] p-0.5',
        className
      )}
      style={{
        background: `linear-gradient(${primaryColor}, ${secondaryColor})`
      }}
      href={`/themes/${id}`}
    >
      <div className='flex flex-col w-full h-full rounded-lg bg-black/50'>
        {loggedIn && user.banner ? (
          <UserBanner
            id={user.id}
            hash={user.banner}
            className='w-full rounded-t-lg min-h-[60px] object-cover'
            width={200}
            height={60}
          />
        ) : (
          <div
            className='w-full rounded-t-lg min-h-[60px] bg-black/40'
            style={{
              background: avatarAverageColor
            }}
          />
        )}

        {loggedIn ? (
          <UserAvatar
            id={user.id}
            hash={user.avatar}
            className='shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] rounded-full h-[56px] w-[56px] -mt-8 ml-3'
            width={64}
            height={64}
          />
        ) : (
          <Image
            className='rounded-full h-[56px] w-[56px] -mt-8 ml-3 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]'
            src='https://cdn.discordapp.com/embed/avatars/1.png'
            alt='Placeholder Avatar'
            width={64}
            height={64}
          />
        )}

        <div className='flex flex-col w-full h-full px-4'>
          <span
            className={cn(
              'mt-2 text-sm font-bold',
              contrastColor === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            {loggedIn ? user.global_name : 'Discord'}
          </span>

          <div className='flex items-center gap-x-2'>
            <span
              className={cn(
                'text-xs',
                contrastColor === 'dark' ? 'text-white/60' : 'text-black/60'
              )}
            >
              {loggedIn ? user.username : 'discord'}
            </span>

            {badges.length > 0 && (
              <div className='flex gap-x-0.5 py-0.5 px-1 w-max h-max bg-black/20 rounded-md border border-white/[0.085]'>
                {badges.map((badge, index) => (
                  <Image
                    key={`theme-${primaryColor}-${secondaryColor}-badge-${index}`}
                    className='w-[14px] h-[14px] rounded'
                    src={badge}
                    alt='Badge'
                    width={20}
                    height={20}
                  />
                ))}
              </div>
            )}
          </div>

          <p
            className={cn(
              'mt-3 text-xs line-clamp-2',
              contrastColor === 'dark' ? 'text-white/60' : 'text-black/60'
            )}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </Container>
  );
}