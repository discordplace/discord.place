'use client';

import Chat from '@/app/(templates)/templates/[id]/preview/components/Chat';
import Header from '@/app/(templates)/templates/[id]/preview/components/Header';
import Members from '@/app/(templates)/templates/[id]/preview/components/Members';
import Sidebar from '@/app/(templates)/templates/[id]/preview/components/Sidebar';
import Channels from '@/app/(templates)/templates/[id]/preview/components/Sidebar/Channels';
import FullPageLoading from '@/app/components/FullPageLoading';
import cn from '@/lib/cn';
import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';

export default function Content({ template }) {
  const [focusedChannel, setFocusedChannel] = useState(
    template.data.channels.find(({ defaultFocused }) => defaultFocused) ||
    template.data.channels.find(({ type }) => type === 'category').channels.find(({ defaultFocused }) => defaultFocused)
  );

  const [memberListCollapsed, setMemberListCollapsed] = useState(false);
  const [currentlyOpenedSection, setCurrentlyOpenedSection] = useState('channels');
  const isMobile = useMedia('(max-width: 1024px)', false);

  useEffect(() => {
    if (isMobile && currentlyOpenedSection === 'channels') setMemberListCollapsed(true);
    else if (!isMobile && memberListCollapsed) setMemberListCollapsed(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, currentlyOpenedSection]);

  if (!focusedChannel) return <FullPageLoading />;

  return (
    <div className='flex size-full min-h-svh'>
      <Sidebar
        currentlyOpenedSection={currentlyOpenedSection}
        focusedChannel={focusedChannel}
        isMobile={isMobile}
        setCurrentlyOpenedSection={setCurrentlyOpenedSection}
        setMemberListCollapsed={setMemberListCollapsed}
        template={template}
      />

      <Channels
        currentlyOpenedSection={currentlyOpenedSection}
        data={template.data.channels}
        focusedChannel={focusedChannel}
        isMobile={isMobile}
        setFocusedChannel={setFocusedChannel}
      />

      <div
        className={cn(
          'flex flex-col w-full',
          (isMobile && currentlyOpenedSection !== 'members') && 'hidden'
        )}
      >
        <Header
          focusedChannel={focusedChannel}
          memberListCollapsed={memberListCollapsed}
          setMemberListCollapsed={setMemberListCollapsed}
        />

        <div className='flex size-full'>
          <Chat
            focusedChannel={focusedChannel}
          />

          {!memberListCollapsed && (
            <Members
              currentlyOpenedSection={currentlyOpenedSection}
              isMobile={isMobile}
              template={template}
            />
          )}
        </div>
      </div>
    </div>
  );
}