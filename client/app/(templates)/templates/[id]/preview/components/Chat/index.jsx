'use client';

import CirclePlusIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CirclePlus';
import GifIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Gif';
import NitroIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Nitro';
import StickersIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Stickers';
import EmojiIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/Emoji';

export default function Chat({ focusedChannel }) {
  return (
    <div className='pt-4 relative gap-y-6 hidden lg:flex w-full overflow-y-hidden h-[calc(100dvh_-_48px)] flex-1 bg-[#313338] flex-col'>
      <div className='flex px-4 gap-x-4'>
        <div className='w-[48px] h-[48px] rounded-full bg-[#3f4146] flex-shrink-0' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] rounded-xl bg-[#4e5155] w-[80px]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[100px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[60px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[80px]'  />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[100px]' />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[50px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[80px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[90px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[70px]' />
          </div>
          <div className='w-full max-w-[150px] h-[200px] rounded-xl bg-[#3b3d43]' /> 
        </div>
      </div>

      <div className='flex px-4 gap-x-4'>
        <div className='w-[48px] h-[48px] rounded-full bg-[#3f4146] flex-shrink-0' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] rounded-xl bg-[#4e5155] w-[80px]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[70px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[90px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[65px]'  />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[80px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[100px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[50px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[70px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[90px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[80px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[100px]' />
          </div>
        </div>
      </div>

      <div className='flex px-4 gap-x-4'>
        <div className='w-[48px] h-[48px] rounded-full bg-[#3f4146] flex-shrink-0' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] rounded-xl bg-[#4e5155] w-[80px]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[95px]' />
          </div>
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[55px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[80px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[90px]' />
          </div>
          <div className='max-w-[350px] w-full h-[200px] rounded-xl bg-[#3b3d43]' />
        </div>
      </div>

      <div className='flex px-4 gap-x-4'>
        <div className='w-[48px] h-[48px] rounded-full bg-[#3f4146] flex-shrink-0' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] rounded-xl bg-[#4e5155] w-[80px]' />
          <div className='flex flex-wrap gap-x-1 gap-y-2'>
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[60px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[95px]' />
            <div className='h-[20px] rounded-xl bg-[#3f4146] w-[120px]' />
          </div>
        </div>
      </div>

      <div className='flex px-4 gap-x-4'>
        <div className='w-[48px] h-[48px] rounded-full bg-[#3f4146] flex-shrink-0' />
        <div className='flex flex-col flex-wrap gap-2'>
          <div className='h-[20px] rounded-xl bg-[#4e5155] w-[80px]' />
          <div className='w-full max-w-[150px] h-[250px] rounded-xl bg-[#3b3d43]' /> 
        </div>
      </div>

      <div className='px-4 bg-[#313338] w-full absolute bottom-0 pb-[24px]'>
        <div className='items-center flex w-full min-h-[44px] bg-[#383a40] rounded-lg'>
          <CirclePlusIcon className='min-w-6 min-h-6 w-6 h-6 ml-5 hover:text-[#dbdee1] cursor-pointer text-[#b5bac1]' />
        
          <span className='text-[#6d6f78] truncate ml-4 mr-2 select-none cursor-text'>
            Message #{focusedChannel.name}
          </span>

          <div className='flex justify-end flex-1 w-full mr-4 gap-x-4'>
            <NitroIcon className='w-6 h-6 hover:text-[#dbdee1] cursor-pointer text-[#b5bac1]' />
            <GifIcon className='w-6 h-6 hover:text-[#dbdee1] cursor-pointer text-[#b5bac1]' />
            <StickersIcon className='w-6 h-6 hover:text-[#dbdee1] cursor-pointer text-[#b5bac1]' />
            <EmojiIcon className='w-6 h-6 hover:text-[#dbdee1] cursor-pointer text-[#b5bac1]' />
          </div>
        </div>
      </div>
    </div>
  );
}