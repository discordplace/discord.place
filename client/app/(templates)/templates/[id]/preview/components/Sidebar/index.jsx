'use client';

import { IoCheckmarkCircle, IoMdArrowRoundBack, HiAtSymbol, HiHashtag, HiPlus, FaCompass, FaDiscord, FaPenFancy, FaTrashAlt, BiSolidCopy } from '@/icons';
import Tooltip from '@/app/components/Tooltip/Discord';
import Image from 'next/image';
import CommunityServerBoostedIcon from '@/app/(templates)/templates/[id]/preview/components/Icons/CommunityServerBoosted';
import { useRouter } from 'next-nprogress-bar';
import useModalsStore from '@/stores/modals';
import cn from '@/lib/cn';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import deleteTemplate from '@/lib/request/templates/deleteTemplate';
import { useEffect, useRef, useState } from 'react';
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
      error: () => enableButton('delete-template', 'confirm')
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
            src='/templates/square_logo.png'
            alt='discord.place Square Logo'
            width={48}
            height={48}
            className='select-none rounded-2xl'
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
            src='/templates/disbot_logo.png'
            alt='Disbot Square Logo'
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
                    title: t('templatePreviewPage.topicModal.title'),
                    description: t('templatePreviewPage.topicModal.description', { focusedChannelName: focusedChannel.name }),
                    content: <>
                      <p className='break-words text-sm font-medium text-[#dbdee1]'>{focusedChannel.topic}</p>
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
            className='flex size-[48px] cursor-pointer items-center justify-center rounded-[100%] bg-[#313338] text-[#ff4d4d] transition-all duration-100 ease-in-out hover:rounded-2xl hover:bg-[#ff4d4d] hover:text-white'
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