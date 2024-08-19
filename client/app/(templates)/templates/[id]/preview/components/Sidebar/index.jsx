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
import { FaTrashAlt } from 'react-icons/fa';
import { useShallow } from 'zustand/react/shallow';
import deleteTemplate from '@/lib/request/templates/deleteTemplate';
import { BiSolidCopy } from 'react-icons/bi';
import { useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import Link from 'next/link';
import { t } from '@/stores/language';

export default function Sidebar({ template, focusedChannel, currentlyOpenedSection, setCurrentlyOpenedSection, isMobile, setMemberListCollapsed }) {
  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  async function continueDeleteTemplate() {
    disableButton('delete-template', 'confirm');

    toast.promise(deleteTemplate(template.id), {
      loading: t('templatePreviewPage.toast.deletingTempalte'),
      success: () => {
        closeModal('delete-template');
        setTimeout(() => router.push('/'), 3000);

        return t('templatePreviewPage.toast.templateDeleted', { templateName: template.name });
      },
      error: error => {
        enableButton('delete-template', 'confirm');
        
        return error;
      }
    });
  }

  const [templateIdCopied, setTemplateIdCopied] = useState(false);
  const templateIdCopyTimeoutRef = useRef(null);

  useEffect(() => {
    if (!templateIdCopied) return;

    const timeout = setTimeout(() => setTemplateIdCopied(false), 3000);
    templateIdCopyTimeoutRef.current = timeout;

    return () => clearTimeout(timeout);
  }, [templateIdCopied]);

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

      <Link
        className='relative flex items-center cursor-pointer'
        href='https://disbot.com.tr'
        target='_blank'
      >
        <Tooltip
          content={
            <>
              <CommunityServerBoostedIcon className='inline mr-2 w-[18px] h-[18px]' />

              Disbot
            </>
          }
          side='right'
          theme='discord'
        >
          <Image
            src="/templates/disbot_logo.png"
            alt="Disbot Square Logo"
            width={48}
            height={48}
            className='select-none rounded-2xl'
          />
        </Tooltip>
      </Link>

      <Tooltip
        content={t('templatePreviewPage.tooltip.addAServer')}
        side='right'
      >
        <div className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl">
          <HiPlus size={24} />
        </div>
      </Tooltip>

      <Tooltip
        content={t('templatePreviewPage.tooltip.exploreDiscoverableServers')}
        side='right'
      >
        <div className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl">
          <FaCompass size={24} />
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
            <div
              className={cn(
                'bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl',
                !focusedChannel.topic && 'opacity-50'
              )}
              onClick={() => 
                !focusedChannel.topic ? 
                  toast.error(t('templatePreviewPage.noTopic', { focusedChannelName: focusedChannel.name })) :
                  openModal('view-topic', {
                    title: t('templatePreviewPage.topicModal.title'),
                    description: t('templatePreviewPage.topicModal.description', { focusedChannelName: focusedChannel.name }),
                    content: <>
                      <p className='text-[#dbdee1] text-sm font-medium break-words'>{focusedChannel.topic}</p>
                    </>,
                    buttons: [
                      {
                        id: 'cancel',
                        label: t('buttons.close'),
                        variant: 'ghost',
                        actionType: 'close'
                      }
                    ]
                  })
              }
            >
              <FaPenFancy size={24} />
            </div>
          )}
        </>
      )}

      <Tooltip
        content={t('templatePreviewPage.tooltip.backToDiscordPlace')}
        side='right'
      >
        <div
          className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl"
          onClick={() => router.back()}
        >
          <IoMdArrowRoundBack size={24} />
        </div>
      </Tooltip>

      <Tooltip
        content={t('templatePreviewPage.tooltip.copyTemplateId')}
        side='right'
      >
        <div
          className={cn(
            'bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#23a559] text-[#23a559] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl',
            templateIdCopied && 'opacity-70 pointer-events-none'
          )}
          onClick={() => {
            if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

            setTemplateIdCopied(true);
            navigator.clipboard.writeText(template.id);
            toast.success(t('templatePreviewPage.toast.templateIdCopied', { templateId: template.id }));
          }}
        >
          <IoCheckmarkCircle 
            size={20} 
            className={cn(
              'transition-[opacity] ease-in-out absolute',
              !templateIdCopied && 'opacity-0'
            )} 
          />
          <BiSolidCopy
            size={20}
            className={cn(
              'transition-[opacity] ease-in-out',
              templateIdCopied && 'opacity-0'
            )}
          />
        </div>
      </Tooltip>

      {template.permissions.canDelete && (
        <Tooltip
          content={t('templatePreviewPage.tooltip.deleteTemplate')}
          side='right'
        >
          <div
            className="bg-[#313338] w-[48px] h-[48px] flex items-center justify-center hover:bg-[#ff4d4d] text-[#ff4d4d] hover:text-white cursor-pointer transition-all ease-in-out duration-100 rounded-[100%] hover:rounded-2xl"
            onClick={() => 
              openModal('delete-template', {
                title: t('templatePreviewPage.deleteTemplateModal.title'),
                description: t('templatePreviewPage.deleteTemplateModal.description', { templateName: template.name }),
                content: (
                  <p className='text-sm text-tertiary'>
                    {t('templatePreviewPage.deleteTemplateModal.note')}
                  </p>
                ),
                buttons: [
                  {
                    id: 'cancel',
                    label: t('buttons.cancel'),
                    variant: 'ghost',
                    actionType: 'close'
                  },
                  {
                    id: 'confirm',
                    label: t('buttons.confirm'),
                    variant: 'solid',
                    action: continueDeleteTemplate
                  }
                ]
              })
            }
          >
            <FaTrashAlt size={20} />
          </div>
        </Tooltip>
      )}
    </div>
  );
}