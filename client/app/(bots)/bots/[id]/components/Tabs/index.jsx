'use client';

import Reviews from '@/app/(bots)/bots/[id]/components/Tabs/Reviews';
import TopVoters from '@/app/(bots)/bots/[id]/components/Tabs/TopVoters';
import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMedia } from 'react-use';

export default function Tabs({ bot }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      component: <Reviews bot={bot} />,
      id: 'reviews',
      label: t('botPage.tabs.labels.reviews')
    },
    {
      component: <TopVoters bot={bot} />,
      disabled: bot.totalVoters <= 0,
      id: 'topVoters',
      label: t('botPage.tabs.labels.topVoters')
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