import { useState } from 'react';
import TopVoters from '@/app/(servers)/servers/[id]/components/Tabs/TopVoters';
import VoiceActivityGraph from '@/app/(servers)/servers/[id]/components/Tabs/Graph/VoiceActivity';
import Reviews from '@/app/(servers)/servers/[id]/components/Tabs/Reviews';
import Tooltip from '@/app/components/Tooltip';
import TabSwitcher from '@/app/(servers)/servers/[id]/components/Tabs/TabSwitcher';

export default function Tabs({ server }) {
  const [activeTab, setActiveTab] = useState('reviews');
  const tabs = [
    {
      label: 'Reviews',
      id: 'reviews',
      component: <Reviews server={server} />
    },
    {
      label: 'Top Voters',
      id: 'topVoters',
      component: <TopVoters server={server} />,
      disabled: server.votes <= 0,
      tooltip: 'No votes on this server yet.'
    },
    {
      label: 'Voice Activity',
      id: 'voiceActivityGraph',
      component: <VoiceActivityGraph server={server} />,
      disabled: !server.voiceActivity || server.voiceActivity.filter?.(activity => new Date(activity.createdAt) > new Date(Date.now() - 86400000))?.length === 0,
      tooltip: !server.voiceActivity ? 'Voice activity is disabled on this server.' : 'No voice activity in the last 24 hours.'
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