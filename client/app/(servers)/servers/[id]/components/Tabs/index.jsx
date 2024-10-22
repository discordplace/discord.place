'use client';

import MonthlyVotesGraph from '@/app/(servers)/servers/[id]/components/Tabs/Graph/MonthlyVotes';
import Reviews from '@/app/(servers)/servers/[id]/components/Tabs/Reviews';
import Rewards from '@/app/(servers)/servers/[id]/components/Tabs/Rewards';
import TopVoters from '@/app/(servers)/servers/[id]/components/Tabs/TopVoters';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tabs({ server }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      component: <Reviews server={server} />,
      id: 'reviews',
      label: t('serverPage.tabs.labels.reviews')
    },
    {
      component: <TopVoters server={server} />,
      disabled: server.votes <= 0,
      id: 'topVoters',
      label: t('serverPage.tabs.labels.topVoters')
    },
    {
      component: <Rewards server={server} />,
      disabled: server.rewards.length === 0,
      id: 'rewards',
      label: t('serverPage.tabs.labels.rewards')
    },
    {
      component: <MonthlyVotesGraph server={server} />,
      disabled: server.monthly_votes.length === 0,
      id: 'monthlyVotesGraph',
      label: t('serverPage.tabs.labels.monthlyVotes')
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <>
      {isMobile ? (
        <div className='m-8 grid grid-cols-2 grid-rows-1 gap-2'>
          {tabs.map(tab => (
            <div
              className={cn(
                'relative px-4 text-center py-2 text-sm font-semibold rounded-full select-none transition-all duration-500 bg-tertiary',
                activeTab === tab.id && 'z-[10] text-white dark:text-black',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
            >
              <span className='truncate'>
                {tab.label}
              </span>

              {activeTab === tab.id && (
                <motion.div
                  className='pointer-events-none absolute bottom-0 left-0 z-[-1] size-full rounded-full bg-black dark:bg-white'
                  layoutId='tabIndicator'
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='m-8 flex w-max rounded-full bg-tertiary lg:mx-0'>
          {tabs.map(tab => (
            <div className='group relative cursor-pointer select-none' key={tab.id} onClick={() => !tab.disabled && setActiveTab(tab.id)}>
              <div
                className={cn(
                  'px-4 py-2 font-semibold text-sm z-10 relative transition-colors',
                  activeTab === tab.id ? 'text-white dark:text-black duration-500' : 'group-hover:text-tertiary',
                  tab.disabled && 'opacity-50 cursor-not-allowed group-hover:text-primary'
                )}
              >
                {tab.label}
              </div>

              {activeTab === tab.id && (
                <motion.div
                  className='pointer-events-none absolute bottom-0 left-0 size-full rounded-full bg-black dark:bg-white'
                  layoutId='tabIndicator'
                />
              )}
            </div>
          ))}
        </div>
      )}

      {tabs.find(tab => tab.id === activeTab).component}
    </>
  );
}