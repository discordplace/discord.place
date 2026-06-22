'use client';

import { FaChevronDown } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import Image from 'next/image';
import HomeIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Home';
import EventsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Events';
import BrowseChannelsIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/BrowseChannels';
import CommunityServerBoostedIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CommunityServerBoosted';
import TextChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannel';
import TextChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/TextChannelNSFW';
import VoiceChannelIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/VoiceChannel';
import VoiceChannelNSFWIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/VoiceChannelNSFW';
import cn from '@/lib/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Channels({ data, focusedChannel, setFocusedChannel, currentlyOpenedSection, isMobile }) {
  const { t } = useTranslation();
  const [collapsedCategories, setCollapsedCategories] = useState([]);

  return (
    <div
      className={cn(
        'flex max-h-svh min-h-full w-full max-w-[240px] scrollbar-none flex-col overflow-y-auto bg-[#2b2d31] pb-4',
        isMobile && 'max-w-[unset]',
        currentlyOpenedSection !== 'channels' && 'hidden'
      )}
    >
      <div className='relative z-1 flex items-center gap-x-2 bg-linear-to-b from-black/50 via-black/30 to-black/4 px-5 py-3'>
        <CommunityServerBoostedIcon className='size-4' />

        <h1 className='text-sm font-semibold text-white'>discord.place</h1>

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
          'relative z-0 -mt-12',
          isMobile && 'h-[150px] w-full object-cover mobile:h-[200px]'
        )}
      />

      <div className='mt-4 flex flex-col items-center gap-y-0.5 px-2.5'>
        <div className='flex w-full cursor-pointer items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] select-none hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <HomeIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.home')}
        </div>

        <div className='flex w-full cursor-pointer items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] select-none hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <EventsIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.events')}
        </div>

        <div className='flex w-full cursor-pointer items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] select-none hover:bg-[#35373c] hover:text-[#dbdee1]'>
          <BrowseChannelsIcon className='size-5 min-h-5 min-w-5 text-[#80848e]' />
          {t('templatePreviewPage.channels.browseChannels')}
        </div>

        <div className='mt-[10.5px] h-px w-full bg-[#3b3d44]' />

        {data.map((channel, index) => (
          channel.type === 'category' ? (
            <div
              key={channel.id}
              className='flex w-full flex-col gap-y-0.5 pt-4 select-none'
            >
              <span
                className='-ml-1.5 flex cursor-pointer items-center gap-x-1 text-[11px] font-semibold text-[#949ba4] uppercase hover:text-[#dbdee1]'
                onClick={() => setCollapsedCategories(old => (old.includes(index) ? old.filter(i => i !== index) : [...old, index]))}
              >
                <IoChevronDown
                  className={cn(
                    collapsedCategories.includes(index) && '-rotate-90 transform'
                  )}
                />
                {channel.name}
              </span>

              {channel.channels.map(categoryChannel => (
                <div
                  key={categoryChannel.id}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] select-none',
                    collapsedCategories.includes(index) && focusedChannel.id !== categoryChannel.id && 'hidden',
                    focusedChannel.id === categoryChannel.id ? 'bg-[#404249] text-white' : 'hover:bg-[#35373c] hover:text-[#dbdee1]'
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
                'flex w-full cursor-pointer items-center gap-x-1.5 rounded-md px-[8px] py-[6px] text-sm font-medium text-[#949ba4] select-none',
                focusedChannel.id === channel.id ? 'bg-[#404249] text-white' : 'hover:bg-[#35373c] hover:text-[#dbdee1]',
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