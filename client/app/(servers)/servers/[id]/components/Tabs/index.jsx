'use client';

import cn from '@/lib/cn';
import { useState } from 'react';
import TopVoters from '@/app/(servers)/servers/[id]/components/Tabs/TopVoters';
import MonthlyVotesGraph from '@/app/(servers)/servers/[id]/components/Tabs/Graph/MonthlyVotes';
import Reviews from '@/app/(servers)/servers/[id]/components/Tabs/Reviews';
import Rewards from '@/app/(servers)/servers/[id]/components/Tabs/Rewards';
import { motion } from 'framer-motion';
import { useMedia } from 'react-use';
import { t } from '@/stores/language';

export default function Tabs({ server }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      label: t('serverPage.tabs.labels.reviews'),
      id: 'reviews',
      component: <Reviews server={server} />
    },
    {
      label: t('serverPage.tabs.labels.topVoters'),
      id: 'topVoters',
      component: <TopVoters server={server} />,
      disabled: server.votes <= 0
    },
    {
      label: t('serverPage.tabs.labels.rewards'),
      id: 'rewards',
      component: <Rewards server={server} />,
      disabled: server.rewards.length === 0
    },
    {
      label: t('serverPage.tabs.labels.monthlyVotes'),
      id: 'monthlyVotesGraph',
      component: <MonthlyVotesGraph server={server} />,
      disabled: server.monthly_votes.length === 0
    }
  ];

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <>
      {isMobile ? (
        <div className='m-8 grid grid-cols-2 grid-rows-1 gap-2'>
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={cn(
                'relative px-4 text-center py-2 text-sm font-semibold rounded-full select-none transition-all duration-500 bg-tertiary',
                activeTab === tab.id && 'z-[10] text-white dark:text-black',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
            >
              <span className='truncate'>
                {tab.label}
              </span>

              {activeTab === tab.id && (
                <motion.div
                  layoutId='tabIndicator'
                  className='pointer-events-none absolute bottom-0 left-0 z-[-1] size-full rounded-full bg-black dark:bg-white'
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
                  layoutId='tabIndicator'
                  className='pointer-events-none absolute bottom-0 left-0 size-full rounded-full bg-black dark:bg-white'
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