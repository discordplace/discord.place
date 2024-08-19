'use client';

import Tooltip from '@/app/components/Tooltip';
import useDashboardStore from '@/stores/dashboard';
import { BiInfoCircle } from 'react-icons/bi';
import { FaCompass } from 'react-icons/fa';
import { MdOutlineArrowOutward } from 'react-icons/md';
import cn from '@/lib/cn';
import { BiSolidUserCircle } from 'react-icons/bi';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdEmojiEmotions } from 'react-icons/md';
import GraphBlock from '@/app/(dashboard)/components/Home/Graph/Block';
import { FaUsers } from 'react-icons/fa';
import { useMedia } from 'react-use';
import { HiTemplate } from 'react-icons/hi';
import { PiWaveformBold } from 'react-icons/pi';
import { t } from '@/stores/language';

export default function Home() {
  const data = useDashboardStore(state => state.data);
  const loading = useDashboardStore(state => state.loading);
  const tooltipSide = useMedia('(max-width: 640px)', false) ? 'bottom' : 'right';

  function StatsBlock({ icon, label, tooltip, current = 0, previous = 0, className }) {
    const isIncreased = current > previous;
    const isDecreased = current < previous;
    const isEqual = current === previous;
    const diffInPercent = ((current - previous) / previous) * 100;
    const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;
    const diffInText = isIncreased ? current - previous : isDecreased ? previous - current : 0;

    return (
      <div className={cn(
        'flex flex-col p-6 border rounded-xl border-primary bg-secondary gap-y-4',
        className
      )}>
        <div className='flex justify-between'>
          <h2 className='flex items-center gap-x-2'>
            <div className='p-2 text-lg rounded-full bg-quaternary'>
              {icon}
            </div>
            <span className='font-semibold text-primary'>{label}</span>
          </h2>

          <Tooltip content={tooltip}>
            <div className='text-tertiary'>
              <BiInfoCircle />
            </div>
          </Tooltip>
        </div>

        <h1 className='flex items-center text-3xl font-bold text-primary gap-x-2'>
          {current}
          
          {!loading && (
            <Tooltip
              side={tooltipSide}
              content={t(`graph.tooltip.${isIncreased ? 'increased' : isDecreased ? 'decreased' : 'noChange'}`, { difference: diffInText })}
            >
              <div className={cn(
                'select-none flex w-max gap-x-1 px-2 items-center py-1 text-xs font-semibold rounded-lg',
                isIncreased && 'dark:bg-emerald-300/10 dark:text-emerald-300 bg-emerald-600/10 text-emerald-600',
                isDecreased && 'dark:bg-red-400/10 dark:text-red-400 bg-red-600/10 text-red-600', 
                isEqual && 'bg-quaternary text-tertiary'
              )}>
                <span>{diffInPercentClean.toFixed(1)}%</span>

                {isIncreased && <MdOutlineArrowOutward />}
                {isDecreased && <MdOutlineArrowOutward className='rotate-180' />}
              </div>
            </Tooltip>
          )}
        </h1>
      </div>
    );
  }

  const previousGuildsData = data.guilds?.[1]?.value;
  const currentGuildsData = data.guilds?.[0]?.value;
  const isGuildsIncreased = currentGuildsData > previousGuildsData;
  const isGuildsDecreased = currentGuildsData < previousGuildsData;

  const previousUsersData = data.users?.[1]?.value;
  const currentUsersData = data.users?.[0]?.value;
  const isUsersIncreased = currentUsersData > previousUsersData;
  const isUsersDecreased = currentUsersData < previousUsersData;

  return (
    <div className="flex flex-col my-8 gap-y-4">
      <div className='grid grid-cols-1 gap-6 mr-6 sm:grid-cols-2 2xl:grid-cols-6'>
        <StatsBlock
          icon={<FaCompass />}
          label='Servers'
          tooltip='Total number of servers created on discord.place.'
          current={data.servers?.[0]?.value}
          previous={data.servers?.[1]?.value}
        />

        <StatsBlock
          icon={<BiSolidUserCircle />}
          label='Profiles'
          tooltip='Total number of profiles created on discord.place.'
          current={data.profiles?.[0]?.value}
          previous={data.profiles?.[1]?.value}
        />

        <StatsBlock
          icon={<RiRobot2Fill />}
          label='Bots'
          tooltip='Total number of bots created on discord.place.'
          current={data.bots?.[0]?.value}
          previous={data.bots?.[1]?.value}
        />

        <StatsBlock
          icon={<MdEmojiEmotions />}
          label='Emojis'
          tooltip='Total number of emojis created on discord.place.'
          current={data.emojis?.[0]?.value}
          previous={data.emojis?.[1]?.value}
        />

        <StatsBlock
          icon={<HiTemplate />}
          label='Templates'
          tooltip='Total number of templates created on discord.place.'
          current={data.templates?.[0]?.value}
          previous={data.templates?.[1]?.value}
          className='sm:col-span-2 xl:col-span-1'
        />

        <StatsBlock
          icon={<PiWaveformBold />}
          label='Sounds'
          tooltip='Total number of sounds created on discord.place.'
          current={data.sounds?.[0]?.value}
          previous={data.sounds?.[1]?.value}
          className='sm:col-span-2 xl:col-span-1'
        />
      </div>

      <GraphBlock
        icon={<FaCompass />}
        label='Total Servers'
        description='Total number of servers that are invited discord.place bot to their server.'
        data={data.guilds}
        tooltipIcon='<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path><path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"></path></svg>'
        tooltipLabel='Servers'
        tooltipFormatter={value => `${value} Servers`}
        color={
          isGuildsIncreased ? '#64b071' :
            isGuildsDecreased ? '#e75f62' :
              '#b4b4b4'
        }
      />

      <GraphBlock
        icon={<FaUsers />}
        label='Total Users'
        description='Total number of users that are using discord.place bot.'
        data={data.users}
        tooltipIcon='<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>'
        tooltipLabel='Users'
        tooltipFormatter={value => `${value} Users`}
        color={
          isUsersIncreased ? '#64b071' :
            isUsersDecreased ? '#e75f62' :
              '#b4b4b4'
        }
      />
    </div>
  );
}