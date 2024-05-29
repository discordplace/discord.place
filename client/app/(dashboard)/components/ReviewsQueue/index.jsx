import useDashboardStore from '@/stores/dashboard';
import { useState } from 'react';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import Approved from '@/app/(dashboard)/components/ReviewsQueue/Table/Approved';
import WaitingApproval from '@/app/(dashboard)/components/ReviewsQueue/Table/WaitingApproval';

export default function ReviewsQueue() {
  const data = useDashboardStore(state => state.data);

  const unapprovedReviews = data?.queue?.reviews?.filter(review => !review.approved).length || 0;
  const approvedReviews = data?.queue?.reviews?.filter(review => review.approved).length || 0;

  const [currentTab, setCurrentTab] = useState('waiting-approval');
  const tabs = [
    {
      label: `Waiting Approval (${unapprovedReviews})`,
      value: 'waiting-approval',
      component: <WaitingApproval data={data?.queue?.reviews?.filter(review => !review.approved)} />
    },
    {
      label: `Approved (${approvedReviews})`,
      value: 'approved',
      component: <Approved data={data?.queue?.reviews?.filter(review => review.approved)} />
    }
  ];

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Reviews Queue
            <span className="text-base font-normal text-tertiary">
              {data?.queue?.reviews?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the reviews that listed on discord.place.
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
                layoutId='botsQueueCurrentTabIndicator'
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