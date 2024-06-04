'use client';

import TextChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannel';
import TextChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannelNSFW';
import ThreadsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Threads';
import NotificationSettingsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/NotificationSettings';
import PinnedMessagesIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/PinnedMessages';
import MemberListIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/MemberList';
import InboxIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Inbox';
import HelpIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Help';
import SearchIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Search';
import Tooltip from '@/app/components/Tooltip/Discord';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Header({ focusedChannel }) {
  return (
    <div className='flex bg-[#313338] justify-between w-full px-[8px] py-[12px] border-b border-b-[#26282c]'>
      <div className='flex items-center ml-2 text-sm gap-x-2'>
        {focusedChannel.type === 'text' && (
          focusedChannel.nsfw ? (
            <TextChannelNSFWIcon className='w-6 h-6 text-[#80848e]' />
          ) : (
            <TextChannelIcon className='w-6 h-6 text-[#80848e]' />
          )
        )}

        <span className='text-[#dbdee1] font-semibold'>{focusedChannel.name}</span>

        {focusedChannel.topic && (
          <>
            <div className='w-[1px] h-full mx-[8px] bg-[#3f4147]' />

            <span className='text-[#b5bac1]'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ ...props }) => <a {...props} className='text-[#00b0fd] hover:underline' />
                }}
              >
                {focusedChannel.topic}
              </ReactMarkdown>
            </span>
          </>
        )}
      </div>

      <div className='flex gap-x-4'>
        <Tooltip
          content='Threads'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <ThreadsIcon className='w-6 h-6' />
          </div>
        </Tooltip>

        <Tooltip
          content='Notification Settings'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <NotificationSettingsIcon className='w-6 h-6' />
          </div>
        </Tooltip>

        <Tooltip
          content='Pinned Messages'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <PinnedMessagesIcon className='w-6 h-6' />
          </div>
        </Tooltip>

        <Tooltip
          content='Hide Member List'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <MemberListIcon className='w-6 h-6' />
          </div>
        </Tooltip>

        <div className='cursor-text select-none justify-between text-[#949ba4] text-sm px-2 items-center flex rounded-md w-[150px] bg-[#1e1f22]'>
          Search
            
          <SearchIcon className='w-4 h-4' />
        </div>

        <Tooltip
          content='Inbox'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <InboxIcon className='w-6 h-6' />
          </div>
        </Tooltip>

        <Tooltip
          content='Help'
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <HelpIcon className='w-6 h-6' />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}