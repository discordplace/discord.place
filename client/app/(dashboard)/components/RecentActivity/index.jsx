import useDashboardStore from '@/stores/dashboard';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import ModeratorActivity from '@/app/(dashboard)/components/RecentActivity/Table/ModeratorActivity';
import UserActivity from '@/app/(dashboard)/components/RecentActivity/Table/UserActivity';

export default function RecentActivity() {
  const data = useDashboardStore(state => state.data);

  const [currentTab, setCurrentTab] = useState('waiting-approval');
  const tabs = [
    {
      label: `Moderator Activity (${data?.recentActivity?.filter(activity => activity.type === 'MODERATOR_ACTIVITY').length})`,
      value: 'moderator-activity',
      component: <ModeratorActivity data={data?.recentActivity?.filter(activity => activity.type === 'MODERATOR_ACTIVITY')} />
    },
    {
      label: `User Activity (${data?.recentActivity?.filter(activity => activity.type === 'USER_ACTIVITY').length})`,
      value: 'user-activity',
      component: <UserActivity data={data?.recentActivity?.filter(activity => activity.type === 'USER_ACTIVITY')} />
    }
  ];

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Recent Activity
            <span className="text-base font-normal text-tertiary">
              {data?.recentActivity?.length}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the recent activity that has been happening on the discord.place.
          </p>
        </div>
      </div>

      <div className='flex pb-3 border-b gap-x-4 border-b-primary'>
        {tabs.map(tab => (
          <div
            key={tab.label}
            className={cn(
              'font-medium relative text-sm cursor-pointer text-tertiary px-3 py-1.5 transition-colors hover:text-primary hover:bg-tertiary rounded-lg',
              currentTab === tab.value && 'text-primary pointer-events-none bg-quaternary'
            )}
            onClick={() => setCurrentTab(tab.value)}
          >
            {tab.label}

            {currentTab === tab.value && (
              <motion.div
                layoutId='emojisQueueCurrentTabIndicator'
                className='absolute w-full left-0 h-[1px] bg-black rounded-lg dark:bg-white -bottom-[13px]'
              />
            )}
          </div>
        ))}
      </div>

      {tabs.find(tab => tab.value === currentTab)?.component}
    </div>
  );
}