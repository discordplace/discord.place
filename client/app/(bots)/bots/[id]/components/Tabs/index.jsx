import cn from '@/lib/cn';
import { useState } from 'react';
import TopVoters from '@/app/(bots)/bots/[id]/components/Tabs/TopVoters';
import Reviews from '@/app/(bots)/bots/[id]/components/Tabs/Reviews';

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
      <div className='flex px-8 my-8 lg:px-0'>
        {tabs.map((tab, index) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 font-semibold truncate py-2 text-sm disabled:pointer-events-none disabled:opacity-70',
              activeTab === tab.id ? 'min-w-max bg-black pointer-events-none text-white dark:bg-white dark:text-black' : 'hover:bg-quaternary text-secondary bg-tertiary',
              index === 0 && 'rounded-l-xl',
              index === tabs.length - 1 && 'rounded-r-xl',
              index !== 0 && index !== tabs.length - 1 && 'border-l border-r border-primary'
            )}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
        
      {tabs.find(tab => tab.id === activeTab).component}
    </>
  );
}