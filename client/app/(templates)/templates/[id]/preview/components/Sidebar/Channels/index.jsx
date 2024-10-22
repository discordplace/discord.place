'use client';

import Image from 'next/image';
import { FaChevronDown } from 'react-icons/fa';
import HomeIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Home';
import EventsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Events';
import BrowseChannelsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/BrowseChannels';
import CommunityServerBoostedIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CommunityServerBoosted';
import TextChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannel';
import TextChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannelNSFW';
import VoiceChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/VoiceChannel';
import VoiceChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/VoiceChannelNSFW';
import cn from '@/lib/cn';
import { IoChevronDown } from 'react-icons/io5';
import { useState } from 'react';
import { t } from '@/stores/language';

export default function Channels({ data, focusedChannel, setFocusedChannel, currentlyOpenedSection, isMobile }) {
  const [collapsedCategories, setCollapsedCategories] = useState([]);

  return (
    <div
      className={cn(
        'overflow-y-auto max-h-[100svh] scrollbar-hide pb-4 min-h-full flex flex-col w-full max-w-[240px] bg-[#2b2d31]',
        isMobile && 'max-w-[unset]',
        currentlyOpenedSection !== 'channels' && 'hidden'
      )}
    >
      <div className='relative z-[1] flex items-center gap-x-2 bg-gradient-to-b from-black/50 via-black/30 to-black/[0.04] px-5 py-3'>
        <CommunityServerBoostedIcon className='size-4' />

        <h1 className='text-sm font-semibold text-white '>discord.place</h1>

        <div className='flex w-full flex-1 justify-end text-sm text-[#cbcbce]'>
          <FaChevronDown />
        </div>
      </div>

      <Image
        src='/templates/discord_banner.png'
        alt='discord.place Discord Banner'
        width={512}
        height={512}
        className={cn(
          'relative -mt-12 z-[0]',
          isMobile && 'w-full h-[150px] mobile:h-[200px] object-cover'
        )}
      />

      <div className='mt-4 flex flex-col items-center gap-y-0.5 px-2.5'>
        <div className='flex w-full cursor-pointer select-none items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <HomeIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.home')}
        </div>

        <div className='flex w-full cursor-pointer select-none items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <EventsIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.events')}
        </div>

        <div className='flex w-full cursor-pointer select-none items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <BrowseChannelsIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.browseChannels')}
        </div>

        <div className='mt-[10.5px] h-px w-full bg-[#3b3d44]' />

        {data.map((channel, index) => (
          channel.type === 'category' ? (
            <div
              key={channel.id}
              className='flex w-full select-none flex-col gap-y-0.5 pt-4'
            >
              <span
                className='-ml-1.5 flex cursor-pointer items-center gap-x-1 text-[11px] font-semibold uppercase text-[#949ba4] hover:text-[#dbdee1]'
                onClick={() => setCollapsedCategories(old => old.includes(index) ? old.filter(i => i !== index) : [...old, index])}
              >
                <IoChevronDown
                  className={cn(
                    collapsedCategories.includes(index) && 'transform -rotate-90'
                  )}
                />
                {channel.name}
              </span>

              {channel.channels.map(categoryChannel => (
                <div
                  key={categoryChannel.id}
                  className={cn(
                    'flex select-none cursor-pointer text-[#949ba4] items-center w-full gap-x-1.5 rounded-md font-medium text-sm py-[6px] px-[8px]',
                    collapsedCategories.includes(index) && focusedChannel.id !== categoryChannel.id && 'hidden',
                    focusedChannel.id === categoryChannel.id ? 'bg-[#404249] text-white' : 'hover:text-[#dbdee1] hover:bg-[#35373c]'
                  )}
                  onClick={() => categoryChannel.type !== 'voice' && setFocusedChannel(categoryChannel)}
                >
                  {categoryChannel.type === 'text' && (
                    categoryChannel.nsfw ? (
                      <TextChannelNSFWIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                    ) : (
                      <TextChannelIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                    )
                  )}

                  {categoryChannel.type === 'voice' && (
                    categoryChannel.nsfw ? (
                      <VoiceChannelNSFWIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                    ) : (
                      <VoiceChannelIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                    )
                  )}

                  <span className='truncate'>
                    {categoryChannel.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              key={channel.id}
              className={cn(
                'flex select-none cursor-pointer text-[#949ba4] items-center w-full gap-x-1.5 rounded-md font-medium text-sm py-[6px] px-[8px]',
                focusedChannel.id === channel.id ? 'bg-[#404249] text-white' : 'hover:text-[#dbdee1] hover:bg-[#35373c]',
                index === 0 && 'mt-3'
              )}
              onClick={() => channel.type !== 'voice' && setFocusedChannel(channel)}
            >
              {channel.type === 'text' && (
                channel.nsfw ? (
                  <TextChannelNSFWIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                ) : (
                  <TextChannelIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                )
              )}

              {channel.type === 'voice' && (
                channel.nsfw ? (
                  <VoiceChannelNSFWIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                ) : (
                  <VoiceChannelIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
                )
              )}

              <span className='truncate'>
                {channel.name}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}