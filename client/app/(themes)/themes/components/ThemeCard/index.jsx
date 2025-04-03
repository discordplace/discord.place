'use client';

import { colord } from 'colord';
import cn from '@/lib/cn';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '@/stores/auth';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import { t } from '@/stores/language';

export default function ThemeCard({ id, primaryColor, secondaryColor }) {
  const isLight = colord(primaryColor).isLight();
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);

  const Container = id ? Link : 'div';

  const profileGradientOverlayColor = isLight ? '#ffffff99' : '#00000099';
  const borderColor = `${colord(primaryColor).invert().alpha(0.12).toHex()}`;

  return (
    <Container
      className={cn(
        'rounded-xl p-1 font-ggSans mobile:min-w-[calc(325px_+_0.5rem)] lg:max-w-[calc(325px_+_0.5rem)] transition-all',
        id ? 'hover:opacity-80' : 'pointer-events-none select-none'
      )}
      href={`/themes/${id}`}
      style={{
        background: `linear-gradient(${primaryColor}, ${secondaryColor})`,
        color: isLight ? 'rgba(var(--light-text-primary))' : 'rgba(var(--dark-text-primary))'
      }}
    >
      <div
        className='relative flex flex-col rounded-lg bg-secondary pb-4 mobile:min-w-[325px] lg:max-w-[calc(325px_+_0.5rem)]'
        style={{
          '--profile-gradient-start': `color-mix(in oklab, ${profileGradientOverlayColor} 100%, ${primaryColor})`,
          '--profile-gradient-end': `color-mix(in oklab, ${profileGradientOverlayColor} 100%, ${secondaryColor})`,
          background: 'linear-gradient(var(--profile-gradient-start), var(--profile-gradient-start) 100%, var(--profile-gradient-end))'
        }}
      >
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
            src={'/status/online.svg'}
            alt={'Online Status Badge'}
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
              {user?.username || 'Discord'}
            </h2>

            {user?.flags.length > 0 && (
              <div
                className='flex items-center gap-1 rounded border bg-[rgba(var(--bg-background),_0.1)] px-1 py-0.5'
                style={{
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

          <p className='mt-2 text-sm'>
            {t('themeCard.quote')}
          </p>
        </div>
      </div>
    </Container>
  );
}