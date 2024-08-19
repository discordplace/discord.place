'use client';

import Tooltip from '@/app/components/Tooltip';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { BiSolidInfoCircle } from 'react-icons/bi';
import { FaLink } from 'react-icons/fa6';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Link from 'next/link';
import { IoMdHeart } from 'react-icons/io';
import { HiCheck } from 'react-icons/hi';
import cn from '@/lib/cn';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import BotCard from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import useThemeStore from '@/stores/theme';
import useLanguageStore, { t } from '@/stores/language';
import config from '@/config';

function StatBlock({ fields, index }) {
  return (
    <div className='flex flex-col w-full gap-y-4' style={{
      alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end'
    }}>
      <div className='w-full flex flex-col gap-y-2 rounded-[2rem] bg-background py-2 px-4'>
        {fields.map(({ Icon, label, value, tooltip, disabled }, index) => (
          <>
            <div className={cn(
              'flex items-center gap-x-2',
              disabled && 'opacity-20 select-none'
            )} key={label}>
              <span className='bg-quaternary rounded-full p-0.5 w-[32px] h-[32px] flex items-center justify-center'>
                <Icon />
              </span>

              <div className='flex flex-col text-sm font-medium text-secondary gap-y-1'>
                <span className='flex items-center text-xs text-tertiary gap-x-2'>
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

            {index !== fields.length - 1 && <div className='bg-tertiary w-full h-[1px]' />}
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
    'Staff': t('userFlags.Staff'),
    'Partner': t('userFlags.Partner'),
    'Hypesquad': t('userFlags.Hypesquad'),
    'BugHunterLevel1': t('userFlags.BugHunterLevel1'),
    'BugHunterLevel2': t('userFlags.BugHunterLevel2'),
    'HypeSquadOnlineHouse1': t('userFlags.HypeSquadOnlineHouse1'),
    'HypeSquadOnlineHouse2': t('userFlags.HypeSquadOnlineHouse2'),
    'HypeSquadOnlineHouse3': t('userFlags.HypeSquadOnlineHouse3'),
    'PremiumEarlySupporter': t('userFlags.PremiumEarlySupporter'),
    'VerifiedDeveloper': t('userFlags.VerifiedDeveloper'),
    'CertifiedModerator': t('userFlags.CertifiedModerator'),
    'ActiveDeveloper': t('userFlags.ActiveDeveloper'),
    'Nitro': t('userFlags.Nitro')
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
    <div className='flex flex-col items-center w-full px-8 mt-32 mb-8 gap-y-8 lg:px-0'>          
      <div className="relative p-3 rounded-[2rem] bg-secondary h-max w-full max-w-[600px]">
        {user.bannerURL ? (
          <div className='relative'>
            <Image
              src={user.bannerURL}
              alt={`${user.username}'s banner`}
              width={1024}
              height={256}
              className="rounded-[2.5rem] h-[200px] object-cover"
            />

            {user.bannerURL.includes('.gif') && (
              <div className='absolute top-4 right-4 pointer-events-none text-white backdrop-blur-2xl shadow-xl shadow-black px-2 py-0.5 rounded-full font-bold text-xs'>
                GIF
              </div>
            )}
          </div>
        ) : (
          <div className="h-[200px] bg-tertiary rounded-[2.5rem]" />
        )}

        <div className='pointer-events-none relative flex items-center w-full -mb-[3rem] sm:-mb-[7.5rem] left-8 bottom-16'>
          <Image
            src={user.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'}
            alt={`${user.username}'s avatar`}
            width={128}
            height={128}
            objectFit="cover"
            className="rounded-full w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] border-8 border-[rgba(var(--bg-secondary))]"
          />
        </div>

        <div className='flex justify-between w-full'>
          <div className='flex sm:ml-[30%] flex-col gap-y-1'>
            <div className='flex items-center ml-2 gap-x-2 sm:ml-0'>
              <h1 className='text-sm font-medium text-tertiary'>
                @{user.username}
              </h1>
              
              {user.flags.length > 0 && (
                <div className='hidden sm:flex items-center gap-x-1.5'>
                  {user.flags
                    .sort((a, b) => flagsPositions.indexOf(a) - flagsPositions.indexOf(b))
                    .map(flag => (
                      <Tooltip
                        key={flag}
                        content={userFlags[flag]}
                      >
                        <Image
                          src={`/user-flags/${flag}.svg`}
                          alt={`${flag} Badge`}
                          width={18}
                          height={18}
                        />
                      </Tooltip>
                    ))}
                </div>
              )}
            </div>

            <h2 className='flex items-center ml-2 text-lg font-semibold sm:ml-0 text-primary gap-x-2'>
              {user.globalName || user.username}

              {user.bot && (
                <span className='select-none flex items-center gap-x-1 px-1.5 py-0.5 rounded-full text-xs font-semibold text-white uppercase bg-[#5865F2]'>
                  {user.bot_verified && (
                    <Tooltip content={t('userFlags.tooltip.verifiedApp')}>
                      <div>
                        <HiCheck />
                      </div>
                    </Tooltip>
                  )}
              
                  {t('userFlags.appBadge')}
                </span>
              )}
            </h2>

            {user.flags.length > 0 && (
              <div className='ml-2 sm:hidden grid grid-cols-4 items-center gap-1.5'>
                {user.flags
                  .sort((a, b) => flagsPositions.indexOf(a) - flagsPositions.indexOf(b))
                  .map(flag => (
                    <Tooltip
                      key={flag}
                      content={userFlags[flag]}
                    >
                      <Image
                        src={`/user-flags/${flag}.svg`}
                        alt={`${flag} Badge`}
                        width={18}
                        height={18}
                      />
                    </Tooltip>
                  ))}
              </div>
            )}
          </div>

          <div className='flex flex-col items-end sm:hidden gap-y-2'>
            <h3 className='font-semibold text-primary'>
              {t('userProfile.badgesHeading')}
            </h3>

            <div className='grid grid-cols-3 grid-rows-2 gap-y-2 gap-x-4'>
              {(user.profile?.badges || []).map(badge => (
                <Tooltip content={badge.tooltip} key={badge.name}>
                  <Image
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badge.name.toLowerCase()}.svg`}
                    alt={`${badge.name} Badge`}
                    width={20}
                    height={20}
                  />
                </Tooltip>
              ))}

              {new Array(6 - (user.profile?.badges || []).length).fill(null).map((_, index) => (
                <div className='w-[20px] h-[20px] bg-tertiary rounded-full' key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 mx-2 mt-4 sm:grid-cols-2'>
          <div className={cn(
            'flex flex-col gap-y-2',
            user.bot && 'opacity-20 select-none'
          )}>
            <h3 className='font-semibold text-primary'>
              {t('userProfile.about.title')}
            </h3>

            <p className='text-sm font-normal whitespace-pre-wrap text-tertiary line-clamp-3'>
              {user.profile?.bio || t('userProfile.about.noBio')}
            </p>
          </div>

          <div className={cn(
            'hidden sm:flex flex-col w-full items-end gap-y-2',
            user.bot && 'opacity-20 select-none'
          )}>
            <h3 className='font-semibold text-primary'>
              {t('userProfile.badgesHeading')}
            </h3>

            <div className='grid grid-cols-3 grid-rows-2 gap-y-4 gap-x-6'>
              {(user.profile?.badges || []).map(badge => (
                <Tooltip content={badge.tooltip} key={badge.name}>
                  <Image
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${badge.name.toLowerCase()}.svg`}
                    alt={`${badge.name} Badge`}
                    width={20}
                    height={20}
                  />
                </Tooltip>
              ))}

              {new Array(6 - (user.profile?.badges || []).length).fill(null).map((_, index) => (
                <div className='w-[20px] h-[20px] bg-tertiary rounded-full' key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2'>
          <StatBlock
            fields={[
              {
                Icon: FaDiscord,
                label: t('userProfile.fields.memberSince'),
                value: new Date(user.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' })
              },
              {
                Icon: TbSquareRoundedChevronUp,
                label: t('userProfile.fields.votesGiven.label'),
                value: user.votesGiven || 0,
                tooltip: t('userProfile.fields.votesGiven.tooltip'),
                disabled: user.bot
              }
            ]}
            index='0'
          />

          <StatBlock
            fields={[
              {
                Icon: FaLink,
                label: t('userProfile.fields.profile.label'),
                value: user.profile ? (
                  <div className='flex items-center gap-x-2'>
                    <span className='truncate max-w-[180px]'>
                      {user.profile.preferredHost}/{user.profile.slug}
                    </span>

                    <Link
                      className='p-0.5 text-xs text-white bg-black rounded-full dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
                      href={config.getProfileURL(user.profile.slug, user.profile.preferredHost)}
                    >
                      <MdOutlineArrowOutward />
                    </Link>
                  </div>
                ) : t('userProfile.fields.profile.noProfile'),
                disabled: user.bot
              },
              {
                Icon: IoMdHeart,
                label: t('userProfile.fields.likesReceived.label'),
                value: user.profile?.likesCount || 0,
                tooltip: t('userProfile.fields.likesReceived.tooltip'),
                disabled: user.bot
              }
            ]}
            index='1'
          />
        </div>
      </div>

      {((user.servers || []).length > 0 || (user.bots || []).length > 0) && (
        <div className='flex flex-col w-full gap-y-2 max-w-[600px]'>
          {(user.servers || []).length > 0 && (
            <>
              <h3 className='text-lg font-semibold text-primary'>
                {t('userProfile.servers.title')}
              </h3>

              <p className='text-sm font-normal text-tertiary'>
                {t('userProfile.servers.subtitle')}
              </p>

              <div className='grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2'>
                {user.servers.map(server => (
                  <div className='flex' key={server.id}>
                    <ServerCard
                      server={{
                        premium: user.premium,
                        data: {
                          members: server.total_members,
                          votes: server.votes
                        },
                        joined_at: server.joined_at,
                        id: server.id,
                        banner_url: server.banner_url,
                        icon_url: server.icon_url,
                        name: server.name,
                        description: server.description,
                        category: server.category
                      }}
                      overridedSort='Votes'
                    />
                  </div>
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

              <div className='grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2'>
                {user.bots.map(bot => (
                  <BotCard
                    data={bot}
                    key={bot.id}
                    overridedSort='Votes'
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}