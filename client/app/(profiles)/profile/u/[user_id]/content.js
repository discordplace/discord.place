'use client';

import BotCard from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import ReportableArea from '@/app/components/ReportableArea';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import useLanguageStore, { t } from '@/stores/language';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidInfoCircle } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';
import { HiCheck } from 'react-icons/hi';
import { IoMdHeart } from 'react-icons/io';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

function StatBlock({ fields, index }) {
  return (
    <div className='flex w-full flex-col gap-y-4' style={{
      alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end'
    }}>
      <div className='flex w-full flex-col gap-y-2 rounded-[2rem] bg-background px-4 py-2'>
        {fields.map(({ disabled, Icon, label, tooltip, value }, index) => (
          <>
            <div
              className={cn(
                'flex items-center gap-x-2',
                disabled && 'opacity-20 select-none'
              )}
              key={label}
            >
              <span className='flex size-[32px] items-center justify-center rounded-full bg-quaternary p-0.5'>
                <Icon />
              </span>

              <div className='flex flex-col gap-y-1 text-sm font-medium text-secondary'>
                <span className='flex items-center gap-x-2 text-xs text-tertiary'>
                  {label}
                  {tooltip && (
                    <Tooltip content={tooltip}>
                      <div>
                        <BiSolidInfoCircle />
                      </div>
                    </Tooltip>
                  )}
                </span>

                {value}
              </div>
            </div>

            {index !== fields.length - 1 && <div className='h-px w-full bg-tertiary' />}
          </>
        ))}
      </div>
    </div>
  );
}

export default function Content({ user }) {
  const theme = useThemeStore(state => state.theme);
  const language = useLanguageStore(state => state.language);

  const userFlags = {
    'ActiveDeveloper': t('userProfile.flags.ActiveDeveloper'),
    'BugHunterLevel1': t('userProfile.flags.BugHunterLevel1'),
    'BugHunterLevel2': t('userProfile.flags.BugHunterLevel2'),
    'CertifiedModerator': t('userProfile.flags.CertifiedModerator'),
    'Hypesquad': t('userProfile.flags.Hypesquad'),
    'HypeSquadOnlineHouse1': t('userProfile.flags.HypeSquadOnlineHouse1'),
    'HypeSquadOnlineHouse2': t('userProfile.flags.HypeSquadOnlineHouse2'),
    'HypeSquadOnlineHouse3': t('userProfile.flags.HypeSquadOnlineHouse3'),
    'Nitro': t('userProfile.flags.Nitro'),
    'Partner': t('userProfile.flags.Partner'),
    'PremiumEarlySupporter': t('userProfile.flags.PremiumEarlySupporter'),
    'Staff': t('userProfile.flags.Staff'),
    'VerifiedDeveloper': t('userProfile.flags.VerifiedDeveloper')
  };

  const flagsPositions = [
    'Staff',
    'Partner',
    'CertifiedModerator',
    'Hypesquad',
    'HypeSquadOnlineHouse1',
    'HypeSquadOnlineHouse2',
    'HypeSquadOnlineHouse3',
    'BugHunterLevel1',
    'BugHunterLevel2',
    'ActiveDeveloper',
    'PremiumEarlySupporter',
    'VerifiedDeveloper',
    'Nitro'
  ];

  return (
    <div className='mb-8 mt-32 flex w-full flex-col items-center gap-y-8 px-8 lg:px-0'>
      <div className='relative h-max w-full max-w-[600px] rounded-[2rem] bg-secondary p-3'>
        {user.bannerURL ? (
          <div className='relative'>
            <Image
              alt={`${user.username}'s banner`}
              className='h-[200px] rounded-[2.5rem] object-cover'
              height={256}
              src={user.bannerURL}
              width={1024}
            />

            {user.bannerURL.includes('.gif') && (
              <div className='pointer-events-none absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-xl shadow-black backdrop-blur-2xl'>
                GIF
              </div>
            )}
          </div>
        ) : (
          <div className='h-[200px] rounded-[2.5rem] bg-tertiary' />
        )}

        <div className='pointer-events-none relative bottom-16 left-8 -mb-12 flex w-full items-center sm:mb-[-7.5rem]'>
          <Image
            alt={`${user.username}'s avatar`}
            className='size-[100px] rounded-full border-8 border-[rgba(var(--bg-secondary))] sm:size-[128px]'
            height={128}
            objectFit='cover'
            src={user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}
            width={128}
          />
        </div>

        <div className='flex w-full justify-between'>
          <div className='flex flex-col gap-y-1 sm:ml-[30%]'>
            <div className='ml-2 flex items-center gap-x-2 sm:ml-0'>
              <h1 className='text-sm font-medium text-tertiary'>
                @{user.username}
              </h1>

              {user.flags.length > 0 && (
                <div className='hidden items-center gap-x-1.5 sm:flex'>
                  {user.flags
                    .sort((a, b) => flagsPositions.indexOf(a) - flagsPositions.indexOf(b))
                    .map(flag => (
                      <Tooltip
                        content={userFlags[flag]}
                        key={flag}
                      >
                        <Image
                          alt={`${flag} Badge`}
                          height={18}
                          src={`/user-flags/${flag}.svg`}
                          width={18}
                        />
                      </Tooltip>
                    ))}
                </div>
              )}
            </div>

            <h2 className='ml-2 flex items-center gap-x-2 text-lg font-semibold text-primary sm:ml-0'>
              {user.globalName || user.username}

              {user.bot && (
                <span className='flex select-none items-center gap-x-1 rounded-full bg-[#5865F2] px-1.5 py-0.5 text-xs font-semibold uppercase text-white'>
                  {user.bot_verified && (
                    <Tooltip content={t('userProfile.tooltip.verifiedApp')}>
                      <div>
                        <HiCheck />
                      </div>
                    </Tooltip>
                  )}

                  {t('userProfile.appBadge')}
                </span>
              )}
            </h2>

            {user.flags.length > 0 && (
              <div className='ml-2 grid grid-cols-4 items-center gap-1.5 sm:hidden'>
                {user.flags
                  .sort((a, b) => flagsPositions.indexOf(a) - flagsPositions.indexOf(b))
                  .map(flag => (
                    <Tooltip
                      content={userFlags[flag]}
                      key={flag}
                    >
                      <Image
                        alt={`${flag} Badge`}
                        height={18}
                        src={`/user-flags/${flag}.svg`}
                        width={18}
                      />
                    </Tooltip>
                  ))}
              </div>
            )}
          </div>

          <div className='flex flex-col items-end gap-y-2 sm:hidden'>
            <h3 className='font-semibold text-primary'>
              {t('userProfile.badgesHeading')}
            </h3>

            <div className='grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-2'>
              {(user.profile?.badges || []).map(badgeId => (
                <Tooltip
                  content={t(`badges.${badgeId}`, {
                    formatParams: {
                      premiumSince: { day: 'numeric', month: 'long', year: 'numeric' }
                    },
                    lng: language,
                    premiumSince: user.subscriptionCreatedAt
                  })}
                  key={badgeId}
                >
                  <Image
                    alt={`${badgeId} Badge`}
                    height={20}
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badgeId}.svg`}
                    width={20}
                  />
                </Tooltip>
              ))}

              {new Array(6 - (user.profile?.badges || []).length).fill(null).map((_, index) => (
                <div className='size-[20px] rounded-full bg-tertiary' key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className='mx-2 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div
            className={cn(
              'flex flex-col gap-y-2',
              user.bot && 'opacity-20 select-none'
            )}
          >
            <h3 className='font-semibold text-primary'>
              {t('userProfile.about.title')}
            </h3>

            <p className='line-clamp-3 whitespace-pre-wrap text-sm font-normal text-tertiary'>
              {user.profile?.bio || t('userProfile.about.noBio')}
            </p>
          </div>

          <div
            className={cn(
              'hidden sm:flex flex-col w-full items-end gap-y-2',
              user.bot && 'opacity-20 select-none'
            )}
          >
            <h3 className='font-semibold text-primary'>
              {t('userProfile.badgesHeading')}
            </h3>

            <div className='grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-4'>
              {(user.profile?.badges || []).map(badgeId => (
                <Tooltip
                  content={t(`badges.${badgeId}`, {
                    formatParams: {
                      premiumSince: { day: 'numeric', month: 'long', year: 'numeric' }
                    },
                    lng: language,
                    premiumSince: user.subscriptionCreatedAt
                  })}
                  key={badgeId}
                >
                  <Image
                    alt={`${badgeId} Badge`}
                    height={20}
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badgeId}.svg`}
                    width={20}
                  />
                </Tooltip>
              ))}

              {new Array(6 - (user.profile?.badges || []).length).fill(null).map((_, index) => (
                <div className='size-[20px] rounded-full bg-tertiary' key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <StatBlock
            fields={[
              {
                Icon: FaDiscord,
                label: t('userProfile.fields.memberSince'),
                value: new Date(user.createdAt).toLocaleDateString(language, { day: 'numeric', month: 'short', year: 'numeric' })
              },
              {
                disabled: user.bot,
                Icon: TbSquareRoundedChevronUp,
                label: t('userProfile.fields.votesGiven.label'),
                tooltip: t('userProfile.fields.votesGiven.tooltip'),
                value: user.votesGiven || 0
              }
            ]}
            index='0'
          />

          <StatBlock
            fields={[
              {
                disabled: user.bot,
                Icon: FaLink,
                label: t('userProfile.fields.profile.label'),
                value: user.profile ? (
                  <div className='flex items-center gap-x-2'>
                    <span className='max-w-[180px] truncate'>
                      {user.profile.preferredHost}/{user.profile.slug}
                    </span>

                    <Link
                      className='rounded-full bg-black p-0.5 text-xs text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                      href={config.getProfileURL(user.profile.slug, user.profile.preferredHost)}
                    >
                      <MdOutlineArrowOutward />
                    </Link>
                  </div>
                ) : t('userProfile.fields.profile.noProfile')
              },
              {
                disabled: user.bot,
                Icon: IoMdHeart,
                label: t('userProfile.fields.likesReceived.label'),
                tooltip: t('userProfile.fields.likesReceived.tooltip'),
                value: user.profile?.likesCount || 0
              }
            ]}
            index='1'
          />
        </div>
      </div>

      {((user.servers || []).length > 0 || (user.bots || []).length > 0) && (
        <div className='flex w-full max-w-[600px] flex-col gap-y-2'>
          {(user.servers || []).length > 0 && (
            <>
              <h3 className='text-lg font-semibold text-primary'>
                {t('userProfile.servers.title')}
              </h3>

              <p className='text-sm font-normal text-tertiary'>
                {t('userProfile.servers.subtitle')}
              </p>

              <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {user.servers.map(server => (
                  <ReportableArea
                    active={user?.id !== server.owner.id}
                    identifier={`server-${server.id}`}
                    key={server.id}
                    metadata={{
                      description: server.description,
                      icon: server.icon,
                      id: server.id,
                      name: server.name
                    }}
                    type='server'
                  >
                    <div className='flex'>
                      <ServerCard
                        overridedSort='Votes'
                        server={{
                          banner: server.banner,
                          category: server.category,
                          data: {
                            members: server.total_members,
                            votes: server.votes
                          },
                          description: server.description,
                          icon: server.icon,
                          id: server.id,
                          joined_at: server.joined_at,
                          name: server.name,
                          premium: server.premium
                        }}
                      />
                    </div>
                  </ReportableArea>
                ))}
              </div>
            </>
          )}

          {(user.bots || []).length > 0 && (
            <>
              <h3 className='mt-4 text-lg font-semibold text-primary'>
                {t('userProfile.bots.title')}
              </h3>

              <p className='text-sm font-normal text-tertiary'>
                {t('userProfile.bots.subtitle')}
              </p>

              <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {user.bots.map(bot => (
                  <ReportableArea
                    active={user?.id !== bot.owner.id}
                    identifier={`bot-${bot.id}`}
                    key={bot.id}
                    metadata={{
                      avatar: bot.avatar,
                      discriminator: bot.discriminator,
                      id: bot.id,
                      short_description: bot.short_description,
                      username: bot.username
                    }}
                    type='bot'
                  >
                    <BotCard
                      data={bot}
                      key={bot.id}
                      overridedSort='Votes'
                    />
                  </ReportableArea>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}