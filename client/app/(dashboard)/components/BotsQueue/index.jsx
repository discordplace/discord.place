import useDashboardStore from '@/stores/dashboard';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import Approved from '@/app/(dashboard)/components/BotsQueue/Table/Approved';
import WaitingApproval from '@/app/(dashboard)/components/BotsQueue/Table/WaitingApproval';

export default function BotsQueue() {
  const data = useDashboardStore(state => state.data);

  const [currentTab, setCurrentTab] = useState('waiting-approval');
  const tabs = [
    {
      label: `Waiting Approval (${data?.queue?.bots?.filter(bot => !bot.verified).length})`,
      value: 'waiting-approval',
      component: <WaitingApproval data={data?.queue?.bots?.filter(bot => !bot.verified)} />
    },
    {
      label: `Approved (${data?.queue?.bots?.filter(bot => bot.verified).length})`,
      value: 'approved',
      component: <Approved data={data?.queue?.bots?.filter(bot => bot.verified)} />
    }
  ];

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Bots Queue
            <span className="text-base font-normal text-tertiary">
              {data?.queue?.bots?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the bots that listed on discord.place.
          </p>
        </div>
      </div>

      <div className='flex pb-3 border-b gap-x-4 border-b-primary'>
        {tabs.map(tab => (
          <div
            key={tab.label}
            className={cn(
              'font-medium relative text-sm cursor-pointer text-tertiary transition-colors hover:text-primary',
              currentTab === tab.value && 'text-primary pointer-events-none'
            )}
            onClick={() => setCurrentTab(tab.value)}
          >
            {tab.label}

            {currentTab === tab.value && (
              <motion.div
                layoutId='botsQueueCurrentTabIndicator'
                className='absolute w-full h-[1px] bg-black rounded-lg dark:bg-white -bottom-[13px]'
              />
            )}
          </div>
        ))}
      </div>

      {tabs.find(tab => tab.value === currentTab)?.component}
    </div>
  );
}