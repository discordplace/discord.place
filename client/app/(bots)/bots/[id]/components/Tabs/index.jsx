import { useState } from 'react';
import TopVoters from '@/app/(bots)/bots/[id]/components/Tabs/TopVoters';
import Reviews from '@/app/(bots)/bots/[id]/components/Tabs/Reviews';
import Tooltip from '@/app/components/Tooltip';
import TabSwitcher from '@/app/(bots)/bots/[id]/components/Tabs/TabSwitcher';

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
      disabled: bot.votes <= 0,
      tooltip: 'No votes on this bot yet.'
    }
  ];
  
  return (
    <>
      <div className='flex mx-8 my-8 rounded-full lg:mx-0 w-max bg-tertiary'>
        {tabs.map(tab => (
          tab.disabled ? (
            <Tooltip key={tab.id} content={tab.tooltip}>
              <TabSwitcher tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Tooltip>
          ) : (
            <TabSwitcher key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
          )
        ))}
      </div>
        
      {tabs.find(tab => tab.id === activeTab).component}
    </>
  );
}