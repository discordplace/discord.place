'use client';

import CirclePlusIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CirclePlus';
import GifIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Gif';
import NitroIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Nitro';
import StickersIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Stickers';
import EmojiIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Emoji';

export default function Chat({ focusedChannel }) {
  return (
    <div className='relative hidden h-[calc(100svh_-_49px)] w-full flex-1 flex-col gap-y-6 overflow-y-hidden bg-[#313338] pt-4 lg:flex'>
      <div className='flex gap-x-4 px-4'>
        <div className='size-[48px] shrink-0 rounded-full bg-[#3f4146]' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] w-[80px] rounded-xl bg-[#4e5155]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[100px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[60px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[80px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[100px] rounded-xl bg-[#3f4146]' />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[50px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[80px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[90px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[70px] rounded-xl bg-[#3f4146]' />
          </div>
          <div className='h-[200px] w-full max-w-[150px] rounded-xl bg-[#3b3d43]' />
        </div>
      </div>

      <div className='flex gap-x-4 px-4'>
        <div className='size-[48px] shrink-0 rounded-full bg-[#3f4146]' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] w-[80px] rounded-xl bg-[#4e5155]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[70px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[90px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[65px] rounded-xl bg-[#3f4146]' />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[80px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[100px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[50px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[70px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[90px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[80px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[100px] rounded-xl bg-[#3f4146]' />
          </div>
        </div>
      </div>

      <div className='flex gap-x-4 px-4'>
        <div className='size-[48px] shrink-0 rounded-full bg-[#3f4146]' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] w-[80px] rounded-xl bg-[#4e5155]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[95px] rounded-xl bg-[#3f4146]' />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[55px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[80px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[90px] rounded-xl bg-[#3f4146]' />
          </div>
          <div className='h-[200px] w-full max-w-[350px] rounded-xl bg-[#3b3d43]' />
        </div>
      </div>

      <div className='flex gap-x-4 px-4'>
        <div className='size-[48px] shrink-0 rounded-full bg-[#3f4146]' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] w-[80px] rounded-xl bg-[#4e5155]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] w-[60px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[95px] rounded-xl bg-[#3f4146]' />
            <div className='h-[20px] w-[120px] rounded-xl bg-[#3f4146]' />
          </div>
        </div>
      </div>

      <div className='flex gap-x-4 px-4'>
        <div className='size-[48px] shrink-0 rounded-full bg-[#3f4146]' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] w-[80px] rounded-xl bg-[#4e5155]' />
          <div className='h-[250px] w-full max-w-[150px] rounded-xl bg-[#3b3d43]' />
        </div>
      </div>

      <div className='absolute bottom-0 w-full bg-[#313338] px-4 pb-[24px]'>
        <div className='flex min-h-[44px] w-full items-center rounded-lg bg-[#383a40]'>
          <CirclePlusIcon className='ml-5 size-6 min-h-6 min-w-6 cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]' />

          <span className='ml-4 mr-2 cursor-text select-none truncate text-[#6d6f78]'>
            Message #{focusedChannel.name}
          </span>

          <div className='mr-4 flex w-full flex-1 justify-end gap-x-4'>
            <NitroIcon className='size-6 cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]' />
            <GifIcon className='size-6 cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]' />
            <StickersIcon className='size-6 cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]' />
            <EmojiIcon className='size-6 cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]' />
          </div>
        </div>
      </div>
    </div>
  );
}