'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import cn from '@/lib/cn';
import useAuthStore from '@/stores/auth';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import mixPlugin from 'colord/plugins/mix';
import Image from 'next/image';
import Link from 'next/link';

extend([
  mixPlugin,
  a11yPlugin
]);

export default function ThemeCard({ className, id, primaryColor, secondaryColor }) {
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

  const Container = id ? Link : 'div';

  return (
    <Container
      className={cn(
        'hover:opacity-80 transition-all rounded-lg select-none w-full h-max p-0.5',
        className
      )}
      href={`/themes/${id}`}
      style={{
        background: `linear-gradient(${primaryColor}, ${secondaryColor})`
      }}
    >
      <div className='flex size-full flex-col rounded-lg bg-black/50'>
        {loggedIn && user.banner ? (
          <UserBanner
            className='h-[60px] w-full rounded-t-lg object-cover'
            hash={user.banner}
            height={60}
            id={user.id}
            width={200}
          />
        ) : (
          <Image
            alt='Placeholder Banner'
            className='h-[60px] w-full rounded-t-lg object-cover'
            height={60}
            src='/og-black.png'
            width={200}
          />
        )}

        {loggedIn ? (
          <UserAvatar
            className='-mt-8 ml-3 size-[56px] rounded-full shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]'
            hash={user.avatar}
            height={64}
            id={user.id}
            width={64}
          />
        ) : (
          <Image
            alt='Placeholder Avatar'
            className='-mt-8 ml-3 size-[56px] rounded-full shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]'
            height={64}
            src='https://cdn.discordapp.com/embed/avatars/1.png'
            width={64}
          />
        )}

        <div className='flex size-full flex-col px-4'>
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
              <div className='flex size-max gap-x-0.5 rounded-md border border-white/[0.085] bg-black/20 px-1 py-0.5'>
                {badges.map((badge, index) => (
                  <Image
                    alt='Badge'
                    className='size-[14px] rounded'
                    height={20}
                    key={`theme-${primaryColor}-${secondaryColor}-badge-${index}`}
                    src={badge}
                    width={20}
                  />
                ))}
              </div>
            )}
          </div>

          <p
            className={cn(
              'my-3 text-xs line-clamp-2',
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