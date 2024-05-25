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
import BotCard from '@/app/(bots)/bots/components/Hero/PopularBots/Card';

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
              disabled && 'opacity-20'
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
  return (
    <div className='flex flex-col items-center w-full px-8 mt-32 gap-y-8 lg:px-0'>          
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

        <div className='relative flex items-center w-full -mb-[3rem] sm:-mb-[7.5rem] left-8 bottom-16'>
          <Image
            src={user.avatarURL}
            alt={`${user.username}'s avatar`}
            width={128}
            height={128}
            objectFit="cover"
            className="rounded-full w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] border-8 border-[rgba(var(--bg-secondary))]"
          />
        </div>

        <h1 className='ml-2 sm:ml-[30%] text-sm font-medium text-tertiary'>
          @{user.username}
        </h1>

        <h2 className='ml-2 sm:ml-[30%] text-lg font-semibold text-primary flex gap-x-2 items-center'>
          {user.globalName || user.username}
          {user.bot && (
            <span className='flex items-center gap-x-1 px-1.5 py-0.5 rounded-full text-xs font-semibold text-white uppercase bg-[#5865F2]'>
              {user.bot_verified && (
                <HiCheck />
              )}
              
              App
            </span>
          )}
        </h2>

        <div className='grid grid-cols-1 gap-4 mx-2 mt-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-y-2'>
            <h3 className='font-semibold text-primary'>
              About
            </h3>

            <p className='text-sm font-normal whitespace-pre-wrap text-tertiary line-clamp-3'>
              {user.profile?.bio || 'This user has not set a bio yet.'}
            </p>
          </div>

          <div className='flex flex-col w-max sm:w-full sm:items-end gap-y-2'>
            <h3 className='font-semibold text-primary'>
              Badges
            </h3>

            <div className='grid grid-cols-3 grid-rows-2 gap-y-4 gap-x-6'>
              {(user.profile?.badges || []).map(badge => (
                <Tooltip content={badge.tooltip} key={badge.name}>
                  <Image
                    src={`/profile-badges/${badge.name.toLowerCase()}.svg`}
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
                label: 'Member Since',
                value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              },
              {
                Icon: TbSquareRoundedChevronUp,
                label: 'Votes Given',
                value: user.votesGiven || 0,
                tooltip: 'The total number of votes given by this user.',
                disabled: user.bot
              }
            ]}
            index='0'
          />

          <StatBlock
            fields={[
              {
                Icon: FaLink,
                label: 'Profile',
                value: user.profile ? (
                  <div className='flex items-center gap-x-2'>
                    {user.profile.preferredHost}/{user.profile.slug}
                    <Link className='p-0.5 text-xs text-white bg-black rounded-full dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70' href={`https://${user.profile.preferredHost}/${user.profile.slug}`}>
                      <MdOutlineArrowOutward />
                    </Link>
                  </div>
                ) : 'No profile found.',
                disabled: user.bot
              },
              {
                Icon: IoMdHeart,
                label: 'Likes Received',
                value: user.profile?.likesCount || 0,
                tooltip: 'The total number of likes given to this user\'s profile.',
                disabled: user.bot
              }
            ]}
            index='1'
          />
        </div>
      </div>

      {(user.servers.length > 0 || user.bots.length > 0) && (
        <div className='flex flex-col w-full mb-8 gap-y-2 max-w-[600px]'>
          {user.servers.length > 0 && (
            <>
              <h3 className='text-lg font-semibold text-primary'>
                Servers
              </h3>

              <p className='text-sm font-normal text-tertiary'>
                This user is also the owner of the following servers. If you like the user, maybe you like the servers also?
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

        
          {user.bots.length > 0 && (
            <>
              <h3 className='mt-4 text-lg font-semibold text-primary'>
                Bots
              </h3>

              <p className='text-sm font-normal text-tertiary'>
                This user is also the owner of the following bots. If you like the user, maybe you like the bots also?
              </p>

              <div className='grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2'>
                {user.bots.map(bot => (
                  <BotCard data={bot} key={bot.id} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}