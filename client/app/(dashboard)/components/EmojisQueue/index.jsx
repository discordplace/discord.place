import useDashboardStore from '@/stores/dashboard';
import Link from 'next/link';
import { useState } from 'react';
import { TbExternalLink } from 'react-icons/tb';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import Approved from '@/app/(dashboard)/components/EmojisQueue/Table/Approved';
import WaitingApproval from '@/app/(dashboard)/components/EmojisQueue/Table/WaitingApproval';

export default function EmojisQueue() {
  const data = useDashboardStore(state => state.data);

  const [currentTab, setCurrentTab] = useState('waiting-approval');
  const tabs = [
    {
      label: `Waiting Approval (${data?.queue?.emojis?.filter(emoji => !emoji.approved).length})`,
      value: 'waiting-approval',
      component: <WaitingApproval data={data?.queue?.emojis?.filter(emoji => !emoji.approved)} />
    },
    {
      label: `Approved (${data?.queue?.emojis?.filter(emoji => emoji.approved).length})`,
      value: 'approved',
      component: <Approved data={data?.queue?.emojis?.filter(emoji => emoji.approved)} />
    }
  ];

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Emojis Queue
            <span className="text-base font-normal text-tertiary">
              {data?.queue?.emojis?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the emojis that published on discord.place.
          </p>
        </div>

        <Link
          className='flex items-center px-4 py-2 text-sm font-semibold rounded-lg hover:bg-tertiary bg-quaternary gap-x-2'
          href='/emojis/create'
        >
          Publish Emoji
          <TbExternalLink />
        </Link>
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