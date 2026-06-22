'use client';

import cn from '@/lib/cn';
import { useState } from 'react';
import TopVoters from '@/app/(servers)/servers/[id]/components/Tabs/TopVoters';
import MonthlyVotesGraph from '@/app/(servers)/servers/[id]/components/Tabs/Graph/MonthlyVotes';
import Reviews from '@/app/(servers)/servers/[id]/components/Tabs/Reviews';
import Rewards from '@/app/(servers)/servers/[id]/components/Tabs/Rewards';
import { motion } from 'framer-motion';
import { useMedia } from 'react-use';
import { useTranslation } from 'react-i18next';

export default function Tabs({ server }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      component: <Reviews server={server} />,
      id: 'reviews',
      label: t('serverPage.tabs.labels.reviews')
    },
    {
      component: <TopVoters server={server} />,
      disabled: server.totalVoters <= 0,
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
              key={tab.id}
              className={cn(
                'relative rounded-full bg-tertiary px-4 py-2 text-center text-sm font-semibold transition-all duration-500 select-none',
                activeTab === tab.id && 'z-10 text-white dark:text-black',
                tab.disabled && 'cursor-not-allowed opacity-50'
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
                  'relative z-10 px-4 py-2 text-sm font-semibold transition-colors',
                  activeTab === tab.id ? 'text-white duration-500 dark:text-black' : 'group-hover:text-tertiary',
                  tab.disabled && 'cursor-not-allowed opacity-50 group-hover:text-primary'
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