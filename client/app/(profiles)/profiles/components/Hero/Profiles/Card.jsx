// oxlint-disable tailwindcss/no-unknown-classes
'use client';

import { FiArrowUpRight } from 'react-icons/fi';
import { TbWorldShare } from 'react-icons/tb';
import Image from 'next/image';
import CopyButtonCustomTrigger from '@/app/components/CopyButton/CustomTrigger';
import config from '@/config';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import Tooltip from '@/app/components/Tooltip';
import Link from 'next/link';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import a11yPlugin from 'colord/plugins/a11y';
import useLanguageStore, { t } from '@/stores/language';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import useSearchStore from '@/stores/profiles/search';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

extend([
  mixPlugin,
  a11yPlugin
]);

export default function Card(props) {
  const user = useAuthStore(state => state.user);
  const language = useLanguageStore(state => state.language);

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    style: 'decimal'
  });

  const theme = useThemeStore(state => state.theme);
  const haveCustomColors = props.colors?.primary !== null || props.colors?.secondary !== null;
  const averageColor = colord(props.colors.primary).mix(colord(props.colors.secondary)).toHex();
  const contrast = colord(averageColor).contrast();
  const contrastColor = contrast > 2 ? 'dark' : 'light';

  const variables = {
    textPrimary: `rgba(var(--${contrastColor}-text-primary))`,
    textSecondary: `rgba(var(--${contrastColor}-text-secondary))`,
    textTertiary: `rgba(var(--${contrastColor}-text-tertiary))`
  };

  const classesToGenerate = ['text-[rgba(var(--dark-text-primary))]', 'text-[rgba(var(--dark-text-secondary))]', 'text-[rgba(var(--dark-text-tertiary))]', 'text-[rgba(var(--light-text-primary))]', 'text-[rgba(var(--light-text-secondary))]', 'text-[rgba(var(--light-text-tertiary))]'];

  const presences = useSearchStore(state => state.presences);
  const userStatus = presences?.find?.(presence => presence.metadata.id === props.id)?.status;

  if (userStatus && !props.badges.includes('poweredByLantern') && props.badges.push('poweredByLantern'));

  return (
    <ReportableArea
      active={user?.id !== props.id}
      type='profile'
      identifier={`profile-${props.id}-${props.username}`}
      metadata={{
        avatar: props.avatar,
        bio: props.bio,
        global_name: props.global_name,
        id: props.id,
        username: props.username
      }}
    >
      <div className='group relative z-1 h-[461px] w-[300px] overflow-hidden rounded-3xl p-0.5'>
        {props.premium === true && (
          <div
            className={cn(
              'absolute inset-0 z-20 size-full',
              !haveCustomColors && 'pointer-events-none animate-rotate rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)]'
            )}
            style={{
              backgroundImage: haveCustomColors ? `linear-gradient(180deg, ${props.colors.primary}, ${props.colors.secondary})` : null
            }}
          />
        )}

        <div className='hidden'>
          {classesToGenerate.map(classToGenerate => (
            <div
              key={classToGenerate}
              className={classToGenerate}
            />
          ))}
        </div>

        <div
          className={cn(
            'relative z-20 flex size-full flex-col rounded-3xl p-3',
            !haveCustomColors && 'bg-tertiary'
          )}
          style={{
            backgroundColor: haveCustomColors ? props.colors.primary : null,
            backgroundImage: haveCustomColors ? `linear-gradient(180deg, ${props.colors.primary}, ${props.colors.secondary})` : null
          }}
        >
          {props.banner ? (
            <div className='relative size-full max-h-[136px]'>
              <UserBanner
                id={props.id}
                hash={props.banner}
                size={512}
                width={512}
                height={512}
                className='size-full rounded-3xl object-cover'
              />

              {props.banner.startsWith('a_') && (
                <div className='pointer-events-none absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-bold text-white backdrop-blur-2xl'>
                  GIF
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                'h-[140px] w-full rounded-2xl',
                !haveCustomColors ? 'bg-secondary' : 'bg-black/20'
              )}
            />
          )}

          <div className='relative left-[10px] -mt-18'>
            <div className='relative w-max'>
              {props.avatar ? (
                <UserAvatar
                  id={props.id}
                  hash={props.avatar}
                  size={64}
                  width={64}
                  height={64}
                  className={cn(
                    'rounded-full',
                    userStatus && 'mask-[radial-gradient(circle_at_85%_85%,transparent_10px,black_10.2px)]'
                  )}
                />
              ) : (
                <Image
                  src='/default-discord-avatar.png'
                  alt='Default Avatar'
                  width={64}
                  height={64}
                  className={cn(
                    'rounded-full',
                    userStatus && 'mask-[radial-gradient(circle_at_85%_85%,transparent_10px,black_10.2px)]'
                  )}
                />
              )}

              {userStatus && (
                <Tooltip content={t(`profileCard.tooltip.status.${userStatus}`)}>
                  <Image
                    src={`/status/${userStatus}.svg`}
                    alt={userStatus}
                    width={20}
                    height={20}
                    className='absolute right-0 bottom-0 rounded-full p-0.5'
                  />
                </Tooltip>
              )}
            </div>
          </div>

          <div
            className={cn(
              'mt-6 flex w-full flex-1 flex-col rounded-2xl',
              !haveCustomColors ? 'bg-secondary' : 'bg-black/20'
            )}
          >
            <div className='mb-auto px-5 pt-5'>
              <div className='flex gap-x-1'>
                <h2
                  className={cn(
                    'mr-1 max-w-[170px] truncate text-lg font-medium',
                    !haveCustomColors ? 'text-primary' : `text-[${variables.textPrimary}]`
                  )}
                >
                  {props.global_name || props.username}
                </h2>

                {props.badges.map(badgeId => (
                  <Tooltip
                    content={t(`badges.${badgeId}`, {
                      formatParams: {
                        premiumSince: { day: 'numeric', month: 'long', year: 'numeric' }
                      },
                      lng: language,
                      premiumSince: props.subscriptionCreatedAt
                    })}
                    key={badgeId}
                  >
                    {badgeId === 'poweredByLantern' ? (
                      <Link
                        href='https://github.com/discordplace/lantern'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center'
                      >
                        <Image
                          src={`/profile-badges/${(haveCustomColors || theme === 'dark') ? 'white' : 'black'}_poweredByLantern.svg`}
                          width={16}
                          height={16}
                          alt="poweredByLantern Badge"
                          className='size-[16px]'
                        />
                      </Link>
                    ) : (
                      <Image
                        src={`/profile-badges/${(haveCustomColors || theme === 'dark') ? 'white' : 'black'}_${badgeId}.svg`}
                        width={16}
                        height={16}
                        alt={`${badgeId} Badge`}
                        className='size-[16px]'
                      />
                    )}
                  </Tooltip>
                ))}
              </div>
              <h3
                className={cn(
                  '-mt-1 text-sm font-medium',
                  !haveCustomColors ? 'text-tertiary' : `text-[${variables.textTertiary}]`
                )}
              >
                @{props.username}
              </h3>

              <div className='mt-4 flex flex-col gap-y-1'>
                <h3
                  className={cn(
                    'text-sm font-medium',
                    !haveCustomColors ? 'text-tertiary' : `text-[${variables.textTertiary}]`
                  )}
                >
                  {t('profileCard.aboutMe')}
                </h3>

                <p
                  className={cn(
                    'line-clamp-2 text-sm font-medium whitespace-pre-wrap',
                    !haveCustomColors ? 'text-secondary' : `text-[${variables.textSecondary}]`
                  )}
                >
                  {props.bio === 'No bio provided.' ?
                    t('profileCard.noBio')
                    : props.bio
                  }
                </p>
              </div>
            </div>

            <div
              className={cn(
                'my-4 h-px w-full',
                !haveCustomColors ? 'bg-quaternary' : 'bg-black/20'
              )}
            />

            <div className='flex flex-col gap-y-4 px-5 pb-3'>
              <div className='flex gap-x-4'>
                <div className='flex flex-col gap-y-1'>
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      !haveCustomColors ? 'text-tertiary' : `text-[${variables.textTertiary}]`
                    )}
                  >
                    {t('profileCard.fields.likes')}
                  </h3>

                  <p className={cn(
                    'text-sm font-medium',
                    !haveCustomColors ? 'text-primary' : `text-[${variables.textPrimary}]`
                  )}>
                    {formatter.format(props.likes)}
                  </p>
                </div>

                <div className='flex flex-col gap-y-1'>
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      !haveCustomColors ? 'text-tertiary' : `text-[${variables.textTertiary}]`
                    )}
                  >
                    {t('profileCard.fields.views')}
                  </h3>

                  <p className={cn(
                    'text-sm font-medium',
                    !haveCustomColors ? 'text-primary' : `text-[${variables.textPrimary}]`
                  )}>
                    {formatter.format(props.views)}
                  </p>
                </div>

                <div className='flex flex-col gap-y-1'>
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      !haveCustomColors ? 'text-tertiary' : `text-[${variables.textTertiary}]`
                    )}
                  >
                    {t('profileCard.fields.createdAt')}
                  </h3>

                  <p
                    className={cn(
                      'w-[130px] truncate text-sm font-medium',
                      !haveCustomColors ? 'text-primary' : `text-[${variables.textPrimary}]`
                    )}
                  >
                    {new Date(props.createdAt).toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className='flex gap-x-2.5'>
                <Link
                  className={cn(
                    'flex items-center gap-x-0.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-white',
                    !haveCustomColors ? 'bg-purple-600 hover:bg-purple-700' : 'bg-black/30 shadow-xl backdrop-blur-xs hover:bg-black/50'
                  )}
                  href={`/profile/${props.slug}`}
                >
                  <FiArrowUpRight size={18} />
                  {t('buttons.visit')}
                </Link>

                <CopyButtonCustomTrigger
                  successText={t('profileCard.toast.profileUrlCopied')}
                  copyText={config.getProfileURL(props.slug, props.preferredHost)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-x-0.5 rounded-lg px-2 py-1.5 text-sm font-semibold',
                      !haveCustomColors ? 'bg-quaternary text-tertiary hover:bg-purple-600 hover:text-white' : 'bg-black/30 text-white shadow-xl backdrop-blur-xs hover:bg-black/50'
                    )}
                  >
                    <TbWorldShare size={16} />
                    {t('buttons.share')}
                  </button>
                </CopyButtonCustomTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReportableArea>
  );
}