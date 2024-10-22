'use client';

import HelpIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Help';
import InboxIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Inbox';
import MemberListIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/MemberList';
import NotificationSettingsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/NotificationSettings';
import PinnedMessagesIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/PinnedMessages';
import SearchIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Search';
import TextChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannel';
import TextChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannelNSFW';
import ThreadsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Threads';
import Tooltip from '@/app/components/Tooltip/Discord';
import { t } from '@/stores/language';

export default function Header({ focusedChannel, memberListCollapsed, setMemberListCollapsed }) {
  return (
    <div className='hidden w-full justify-between border-b border-b-[#26282c] bg-[#313338] px-[8px] py-[12px] lg:flex'>
      <div className='ml-2 flex items-center gap-x-2 text-sm'>
        {focusedChannel.type === 'text' && (
          focusedChannel.nsfw ? (
            <TextChannelNSFWIcon className='size-6 min-h-6 min-w-6 text-[#80848e]' />
          ) : (
            <TextChannelIcon className='size-6 min-h-6 min-w-6 text-[#80848e]' />
          )
        )}

        <span className='truncate font-semibold text-[#dbdee1]'>{focusedChannel.name}</span>

        {focusedChannel.topic && (
          <>
            <div className='mx-[8px] h-full w-px bg-[#3f4147]' />

            <span className='mr-4 max-w-[100px] truncate text-[#b5bac1] xl:max-w-full'>
              {focusedChannel.topic.length > 50 ? `${focusedChannel.topic.slice(0, 50)}...` : focusedChannel.topic}
            </span>
          </>
        )}
      </div>

      <div className='flex gap-x-4'>
        <Tooltip
          content={t('templatePreviewPage.tooltip.threads')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <ThreadsIcon className='size-6' />
          </div>
        </Tooltip>

        <Tooltip
          content={t('templatePreviewPage.tooltip.notificationSettings')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <NotificationSettingsIcon className='size-6' />
          </div>
        </Tooltip>

        <Tooltip
          content={t('templatePreviewPage.tooltip.pinnedMessages')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <PinnedMessagesIcon className='size-6' />
          </div>
        </Tooltip>

        <Tooltip
          content={memberListCollapsed ? t('templatePreviewPage.tooltip.showMemberList') : t('templatePreviewPage.tooltip.hideMemberList')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div
            className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'
            onClick={() => setMemberListCollapsed(!memberListCollapsed)}
          >
            <MemberListIcon className='size-6' />
          </div>
        </Tooltip>

        <div className='flex w-[150px] cursor-text select-none items-center justify-between rounded-md bg-[#1e1f22] px-2 text-sm text-[#949ba4]'>
          {t('templatePreviewPage.searchInputPlaceholder')}

          <SearchIcon className='size-4' />
        </div>

        <Tooltip
          content={t('templatePreviewPage.tooltip.inbox')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <InboxIcon className='size-6' />
          </div>
        </Tooltip>

        <Tooltip
          content={t('templatePreviewPage.tooltip.help')}
          side='bottom'
          sideOffset={5}
          size='small'
        >
          <div className='cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]'>
            <HelpIcon className='size-6' />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}