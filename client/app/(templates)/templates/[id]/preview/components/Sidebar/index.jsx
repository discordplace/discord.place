'use client';

import Tooltip from '@/app/components/Tooltip/Discord';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { FaCompass } from 'react-icons/fa';
import CommunityServerBoostedIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CommunityServerBoosted';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next-nprogress-bar';
import { HiAtSymbol } from 'react-icons/hi';
import { HiHashtag } from 'react-icons/hi';
import { FaPenFancy } from 'react-icons/fa';
import useModalsStore from '@/stores/modals';
import cn from '@/lib/cn';
import { toast } from 'sonner';

export default function Sidebar({ focusedChannel, currentlyOpenedSection, setCurrentlyOpenedSection, isMobile, setMemberListCollapsed }) {
  const router = useRouter();

  const openModal = useModalsStore(state => state.openModal);

  return (
    <div className="flex items-center flex-col gap-y-2 bg-[#1e1f22] w-max min-h-full pt-4 px-[14px]">
      <div className="bg-[#313338] w-[48px] items-center justify-center flex h-[48px] hover:bg-[#5865F2] transition-all ease-in-out duration-100 cursor-pointer rounded-[100%] hover:rounded-2xl">
        <FaDiscord className="text-[#dbdee1]" size={28} />
      </div>

      <div className='w-[65%] h-[2px] bg-[#35363c] rounded-[1px]' />

      <div className='relative flex items-center cursor-pointer'>
        <div className='absolute h-[80%] w-[4px] bg-white -left-3.5 rounded-r-[4px]' />

        <Tooltip
          content={
            <>
              <CommunityServerBoostedIcon className='inline mr-2 w-[18px] h-[18px]' />

              discord.place
            </>
          }
          side='right'
          theme='discord'
        >
          <Image
            src="/templates/square_logo.png"
            alt="discord.place Square Logo"
            width={48}
            height={48}
            className='select-none rounded-2xl'
          />
        </Tooltip>
      </div>

      <Tooltip
        content='Add a Server'
        side='right'
      >
        <div className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl">
          <HiPlus size={24} />
        </div>
      </Tooltip>

      <Tooltip
        content='Explore Discoverable Servers'
        side='right'
      >
        <div className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl">
          <FaCompass size={24} />
        </div>
      </Tooltip>

      <Tooltip
        content='Back to discord.place'
        side='right'
      >
        <div
          className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl"
          onClick={() => router.back()}
        >
          <IoMdArrowRoundBack size={24} />
        </div>
      </Tooltip>

      {isMobile && (
        <>
          <div
            className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl"
            onClick={() => {
              if (currentlyOpenedSection === 'members') setCurrentlyOpenedSection('channels');
              else {
                setCurrentlyOpenedSection('members');
                setMemberListCollapsed(false);
              }
            }}
          >
            {currentlyOpenedSection === 'members' ? (
              <HiHashtag size={24} />
            ) : (
              <HiAtSymbol size={24} />
            )}
          </div>

          {currentlyOpenedSection === 'channels' && (
            <>
              <div className='w-[65%] h-[2px] bg-[#35363c] rounded-[1px]' />

              <div
                className={cn(
                  'bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl',
                  !focusedChannel.topic && 'opacity-50'
                )}
                onClick={() => 
                  !focusedChannel.topic ? 
                    toast.error(`#${focusedChannel.name} does not have a topic set.`) :
                    openModal('view-topic', {
                      title: 'View Topic',
                      description: `You are currently viewing the topic of the channel: ${focusedChannel.name}.`,
                      content: <>
                        <p className='text-[#dbdee1] text-sm font-medium break-words'>{focusedChannel.topic}</p>
                      </>,
                      buttons: [
                        {
                          id: 'cancel',
                          label: 'Cancel',
                          variant: 'ghost',
                          actionType: 'close'
                        }
                      ]
                    })
                }
              >
                <FaPenFancy size={24} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}