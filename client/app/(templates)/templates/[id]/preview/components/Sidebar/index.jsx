'use client';

import CommunityServerBoostedIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CommunityServerBoosted';
import Tooltip from '@/app/components/Tooltip/Discord';
import cn from '@/lib/cn';
import deleteTemplate from '@/lib/request/templates/deleteTemplate';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { useEffect, useRef, useState } from 'react';
import { BiSolidCopy } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';
import { FaCompass } from 'react-icons/fa';
import { FaPenFancy } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { HiAtSymbol } from 'react-icons/hi';
import { HiHashtag } from 'react-icons/hi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Sidebar({ currentlyOpenedSection, focusedChannel, isMobile, setCurrentlyOpenedSection, setMemberListCollapsed, template }) {
  const router = useRouter();

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  async function continueDeleteTemplate() {
    disableButton('delete-template', 'confirm');

    toast.promise(deleteTemplate(template.id), {
      error: error => {
        enableButton('delete-template', 'confirm');

        return error;
      },
      loading: t('templatePreviewPage.toast.deletingTempalte'),
      success: () => {
        closeModal('delete-template');
        setTimeout(() => router.push('/'), 3000);

        return t('templatePreviewPage.toast.templateDeleted', { templateName: template.name });
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
    <div className='flex min-h-full w-max flex-col items-center gap-y-2 bg-[#1e1f22] px-[14px] pt-4'>
      <div className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#5865F2]'>
        <FaDiscord className='text-[#dbdee1]' size={28} />
      </div>

      <div className='h-[2px] w-[65%] rounded-[1px] bg-[#35363c]' />

      <div className='relative flex cursor-pointer items-center'>
        <div className='absolute -left-3.5 h-4/5 w-[4px] rounded-r-[4px] bg-white' />

        <Tooltip
          content={
            <>
              <CommunityServerBoostedIcon className='mr-2 inline size-[18px]' />

              discord.place
            </>
          }
          side='right'
          theme='discord'
        >
          <Image
            alt='discord.place Square Logo'
            className='select-none rounded-2xl'
            height={48}
            src='/templates/square_logo.png'
            width={48}
          />
        </Tooltip>
      </div>

      <Link
        className='relative flex cursor-pointer items-center'
        href='https://disbot.com.tr'
        target='_blank'
      >
        <Tooltip
          content={
            <>
              <CommunityServerBoostedIcon className='mr-2 inline size-[18px]' />

              Disbot
            </>
          }
          side='right'
          theme='discord'
        >
          <Image
            alt='Disbot Square Logo'
            className='select-none rounded-2xl'
            height={48}
            src='/templates/disbot_logo.png'
            width={48}
          />
        </Tooltip>
      </Link>

      <Tooltip
        content={t('templatePreviewPage.tooltip.addAServer')}
        side='right'
      >
        <div className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#23a559] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#23a559] hover:text-white'>
          <HiPlus size={24} />
        </div>
      </Tooltip>

      <Tooltip
        content={t('templatePreviewPage.tooltip.exploreDiscoverableServers')}
        side='right'
      >
        <div className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#23a559] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#23a559] hover:text-white'>
          <FaCompass size={24} />
        </div>
      </Tooltip>

      {isMobile && (
        <>
          <div
            className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#23a559] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#23a559] hover:text-white'
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
                    buttons: [
                      {
                        actionType: 'close',
                        id: 'cancel',
                        label: t('buttons.close'),
                        variant: 'ghost'
                      }
                    ],
                    content: <>
                      <p className='break-words text-sm font-medium text-[#dbdee1]'>{focusedChannel.topic}</p>
                    </>,
                    description: t('templatePreviewPage.topicModal.description', { focusedChannelName: focusedChannel.name }),
                    title: t('templatePreviewPage.topicModal.title')
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
          className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#23a559] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#23a559] hover:text-white'
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
            className={cn(
              'transition-[opacity] ease-in-out absolute',
              !templateIdCopied && 'opacity-0'
            )}
            size={20}
          />
          <BiSolidCopy
            className={cn(
              'transition-[opacity] ease-in-out',
              templateIdCopied && 'opacity-0'
            )}
            size={20}
          />
        </div>
      </Tooltip>

      {template.permissions.canDelete && (
        <Tooltip
          content={t('templatePreviewPage.tooltip.deleteTemplate')}
          side='right'
        >
          <div
            className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#ff4d4d] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#ff4d4d] hover:text-white'
            onClick={() =>
              openModal('delete-template', {
                buttons: [
                  {
                    actionType: 'close',
                    id: 'cancel',
                    label: t('buttons.cancel'),
                    variant: 'ghost'
                  },
                  {
                    action: continueDeleteTemplate,
                    id: 'confirm',
                    label: t('buttons.confirm'),
                    variant: 'solid'
                  }
                ],
                content: (
                  <p className='text-sm text-tertiary'>
                    {t('templatePreviewPage.deleteTemplateModal.note')}
                  </p>
                ),
                description: t('templatePreviewPage.deleteTemplateModal.description', { templateName: template.name }),
                title: t('templatePreviewPage.deleteTemplateModal.title')
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