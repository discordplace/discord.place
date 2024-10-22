'use client';

import Graph from '@/app/(dashboard)/components/Home/Graph';
import cn from '@/lib/cn';
import useAuthStore from '@/stores/auth';
import useDashboardStore from '@/stores/dashboard';
import { useState } from 'react';

export default function Home() {
  const data = useDashboardStore(state => state.data);
  const user = useAuthStore(state => state.user);
  const isCollapsed = useDashboardStore(state => state.isCollapsed);

  const [activeStatBlock, setActiveStatBlock] = useState('Guilds');

  function StatBlock({ label, previous, value }) {
    const isIncreased = value > previous;
    const isDecreased = value < previous;
    const diffInPercent = ((value - previous) / previous) * 100;
    const diffInPercentClean = diffInPercent === Infinity ? 100 : isNaN(diffInPercent) ? 0 : diffInPercent;

    return (
      <div className='group flex items-center gap-x-4 2xl:[&:not(:first-child)]:ml-4'>
        <div className='hidden h-full w-px bg-[rgba(var(--border-primary))] 2xl:group-[&:not(:first-child)]:block' />

        <div
          className={cn(
            'relative flex rounded-3xl justify-center border 2xl:border-0 flex-col gap-y-2 w-full p-4 min-h-[100px] border-primary',
            activeStatBlock === label ? 'bg-secondary' : 'cursor-pointer hover:bg-secondary'
          )}
          onClick={() => setActiveStatBlock(label)}
        >
          <h2 className='text-sm font-semibold text-secondary'>
            {label}
          </h2>

          <h1 className='text-3xl font-bold text-primary'>
            {value.toLocaleString('en-US')}
          </h1>

          <div className='flex items-center gap-x-1 text-sm text-tertiary'>
            <span
              className={cn(
                'font-medium text-secondary',
                isIncreased && 'text-green-400',
                isDecreased && 'text-red-400'
              )}
            >
              {diffInPercentClean.toFixed(2)}%
            </span>
            from yesterday
          </div>

          {activeStatBlock === label && <div className='absolute bottom-[-1.06rem] left-0 hidden h-px w-full bg-purple-500 2xl:block' />}
        </div>
      </div>
    );
  }

  const currentDay = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short' });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div className='my-8 flex flex-col gap-y-4'>
      <h1 className='text-4xl font-bold text-primary'>
        Welcome back, {user.global_name}!
      </h1>

      <p className='text-tertiary'>
        You can view the statistics of discord.place here.
      </p>

      <div className='mt-4 h-px w-full bg-[rgba(var(--border-primary))]' />

      <div
        className='grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-4 2xl:gap-0'
        key={isCollapsed}
      >
        <StatBlock
          label='Guilds'
          previous={data.guilds?.[1]?.value || 0}
          value={data.guilds?.[0]?.value || 0}
        />

        <StatBlock
          label='Servers'
          previous={data.servers?.[1]?.value || 0}
          value={data.servers?.[0]?.value || 0}
        />

        <StatBlock
          label='Users'
          previous={data.users?.[1]?.value || 0}
          value={data.users?.[0]?.value || 0}
        />

        <StatBlock
          label='Bots'
          previous={data.bots?.[1]?.value || 0}
          value={data.bots?.[0]?.value || 0}
        />
      </div>

      <div className='hidden h-px w-full bg-[rgba(var(--border-primary))] 2xl:block' />

      <div className='flex flex-col gap-y-2'>
        <h2 className='text-sm font-medium text-primary'>
          {sevenDaysAgo} - {currentDay}
        </h2>

        {activeStatBlock === 'Servers' && (
          <Graph
            color={'rgb(168, 85, 247)'}
            data={data.servers || []}
            height={400}
            id='dashboard-servers'
            tooltipFormatter={value => `${value} Servers`}
            tooltipLabel={'Servers'}
          />
        )}

        {activeStatBlock === 'Guilds' && (
          <Graph
            color={'rgb(168, 85, 247)'}
            data={data.guilds || []}
            height={400}
            id='dashboard-guilds'
            tooltipFormatter={value => `${value} Guilds`}
            tooltipLabel={'Guilds'}
          />
        )}

        {activeStatBlock === 'Users' && (
          <Graph
            color={'rgb(168, 85, 247)'}
            data={data.users || []}
            height={400}
            id='dashboard-users'
            tooltipFormatter={value => `${value} Users`}
            tooltipLabel={'Users'}
          />
        )}

        {activeStatBlock === 'Bots' && (
          <Graph
            color={'rgb(168, 85, 247)'}
            data={data.bots || []}
            height={400}
            id='dashboard-bots'
            tooltipFormatter={value => `${value} Bots`}
            tooltipLabel={'Bots'}
          />
        )}
      </div>
    </div>
  );
}