'use client';

import Sidebar from '@/app/(templates)/templates/[id]/preview/components/Sidebar';
import Channels from '@/app/(templates)/templates/[id]/preview/components/Sidebar/Channels';
import Header from '@/app/(templates)/templates/[id]/preview/components/Header';
import Chat from '@/app/(templates)/templates/[id]/preview/components/Chat';
import Members from '@/app/(templates)/templates/[id]/preview/components/Members';
import { useState, useEffect } from 'react';
import FullPageLoading from '@/app/components/FullPageLoading';
import { useMedia } from 'react-use';
import cn from '@/lib/cn';
import { AnimatePresence, motion } from 'framer-motion';

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
  }, [isMobile, currentlyOpenedSection]);

  return (
    <AnimatePresence mode='wait'>
      {!focusedChannel ? (
        <motion.div
          initial={{ filter: 'blur(4px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          exit={{ filter: 'blur(4px)', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <FullPageLoading />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='flex size-full min-h-svh'
        >
          <Sidebar
            template={template}
            focusedChannel={focusedChannel}
            currentlyOpenedSection={currentlyOpenedSection}
            setCurrentlyOpenedSection={setCurrentlyOpenedSection}
            isMobile={isMobile}
            setMemberListCollapsed={setMemberListCollapsed}
          />

          <Channels
            data={template.data.channels}
            focusedChannel={focusedChannel}
            setFocusedChannel={setFocusedChannel}
            currentlyOpenedSection={currentlyOpenedSection}
            isMobile={isMobile}
          />

          <div
            className={cn(
              'flex w-full flex-col',
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
                  template={template}
                  isMobile={isMobile}
                  currentlyOpenedSection={currentlyOpenedSection}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}