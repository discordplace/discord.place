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
    <div className={cn(
      'overflow-y-auto max-h-[100svh] scrollbar-hide pb-4 min-h-full flex flex-col w-full max-w-[240px] bg-[#2b2d31]',
      isMobile && 'max-w-[unset]',
      currentlyOpenedSection !== 'channels' && 'hidden'
    )}>
      <div className='relative z-[1] flex items-center px-5 py-3 gap-x-2 bg-gradient-to-b from-black/50 via-black/30 to-black/[0.04]'>
        <CommunityServerBoostedIcon className='w-4 h-4' />

        <h1 className='text-sm font-semibold text-white '>discord.place</h1>

        <div className='flex text-[#cbcbce] justify-end flex-1 w-full text-sm'>
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

      <div className='flex flex-col items-center px-2.5 mt-4 gap-y-0.5'>
        <div className='flex select-none cursor-pointer text-[#949ba4] hover:text-[#dbdee1] items-center w-full gap-x-1.5 rounded-md font-medium text-sm hover:bg-[#35373c] py-[6px] px-[8px]'>
          <HomeIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.home')}
        </div>

        <div className='flex select-none cursor-pointer text-[#949ba4] hover:text-[#dbdee1] items-center w-full gap-x-1.5 rounded-md font-medium text-sm hover:bg-[#35373c] py-[6px] px-[8px]'>
          <EventsIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.events')}
        </div>

        <div className='flex select-none cursor-pointer text-[#949ba4] hover:text-[#dbdee1] items-center w-full gap-x-1.5 rounded-md font-medium text-sm hover:bg-[#35373c] py-[6px] px-[8px]'>
          <BrowseChannelsIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.browseChannels')}
        </div>

        <div className='w-full h-[1px] mt-[10.5px] bg-[#3b3d44]' />
      
        {data.map((channel, index) => (
          channel.type === 'category' ? (
            <div
              key={channel.id}
              className='flex flex-col w-full pt-4 select-none gap-y-0.5'
            >
              <span
                className='uppercase -ml-1.5 text-[11px] text-[#949ba4] hover:text-[#dbdee1] cursor-pointer flex items-center gap-x-1 font-semibold'
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
                    collapsedCategories.includes(index) && focusedChannel.id !== categoryChannel.id  && 'hidden',
                    focusedChannel.id === categoryChannel.id ? 'bg-[#404249] text-white' : 'hover:text-[#dbdee1] hover:bg-[#35373c]'
                  )}
                  onClick={() => categoryChannel.type !== 'voice' && setFocusedChannel(categoryChannel)}
                >
                  {categoryChannel.type === 'text' && (
                    categoryChannel.nsfw ? (
                      <TextChannelNSFWIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                    ) : (
                      <TextChannelIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                    )
                  )}

                  {categoryChannel.type === 'voice' && (
                    categoryChannel.nsfw ? (
                      <VoiceChannelNSFWIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                    ) : (
                      <VoiceChannelIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
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
                  <TextChannelNSFWIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                ) : (
                  <TextChannelIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                )
              )}

              {channel.type === 'voice' && (
                channel.nsfw ? (
                  <VoiceChannelNSFWIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
                ) : (
                  <VoiceChannelIcon className='min-w-5 min-h-5 w-5 h-5 text-[#80848e]' />
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