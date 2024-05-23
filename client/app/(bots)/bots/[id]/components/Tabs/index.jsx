import cn from '@/lib/cn';
import { useState } from 'react';
import TopVoters from '@/app/(bots)/bots/[id]/components/Tabs/TopVoters';
import Reviews from '@/app/(bots)/bots/[id]/components/Tabs/Reviews';
import { motion } from 'framer-motion';

export default function Tabs({ bot }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      label: 'Reviews',
      id: 'reviews',
      component: <Reviews bot={bot} />
    },
    {
      label: 'Top Voters',
      id: 'topVoters',
      component: <TopVoters bot={bot} />,
      disabled: bot.votes <= 0
    }
  ];
  
  return (
    <>
      <div className='flex mx-8 my-8 rounded-full lg:mx-0 w-max bg-tertiary'>
        {tabs.map(tab => (
          <div className='relative cursor-pointer select-none group' key={tab.id} onClick={() => !tab.disabled && setActiveTab(tab.id)}>
            <div className={cn(
              'px-4 py-2 font-semibold text-sm z-10 relative transition-colors',
              activeTab === tab.id ? 'text-white dark:text-black duration-500' : 'group-hover:text-tertiary',
              tab.disabled && 'opacity-50 cursor-not-allowed group-hover:text-primary'
            )}>
              {tab.label}
            </div>

            {activeTab === tab.id && (
              <motion.div
                layoutId='tabIndicator'
                className='absolute bottom-0 left-0 w-full h-full bg-black rounded-full pointer-events-none dark:bg-white'
              />
            )}
          </div>
        ))}
      </div>
        
      {tabs.find(tab => tab.id === activeTab).component}
    </>
  );
}