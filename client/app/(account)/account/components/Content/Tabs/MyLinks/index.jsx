'use client';

import ErrorState from '@/app/components/ErrorState';
import useAuthStore from '@/stores/auth';
import useModalsStore from '@/stores/modals';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { FiExternalLink, FiLink, FiTrash2 } from 'react-icons/fi';
import { LuPlus } from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';
import deleteLink from '@/lib/request/links/deleteLink';
import { toast } from 'sonner';
import CreateLinkModal from '@/app/(account)/account/components/Content/Tabs/MyLinks/CreateLinkModal';
import useGeneralStore from '@/stores/general';
import createLink from '@/lib/request/links/createLink';
import useAccountStore from '@/stores/account';
import { PiWarningCircleFill } from 'react-icons/pi';
import CopyButton from '@/app/components/CopyButton/CustomTrigger';
import { MdOutlineCopyAll } from 'react-icons/md';
import { t } from '@/stores/language';

export default function MyLinks() {
  const user = useAuthStore(state => state.user);
  const fetchData = useAccountStore(state => state.fetchData);
  const data = useAccountStore(state => state.data);

  const canCreateNewLink = user?.premium?.createdAt ?
    data.links?.length < 5 : data.links?.length < 1;

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteLink(id) {
    disableButton('delete-link', 'confirm');
  
    toast.promise(deleteLink(id), {
      loading: t('accountPage.tabs.myLinks.toast.deletingLink'),
      success: () => {
        closeModal('delete-link');
        fetchData(['links']);
        
        return t('accountPage.tabs.myLinks.toast.linkDeleted');
      },
      error: error => {
        enableButton('delete-link', 'confirm');
  
        return error;
      }
    });
  }

  function continueCreateLink() {
    openModal('create-link', {
      title: t('accountPage.tabs.myLinks.createLinkModal.title'),
      description: t('accountPage.tabs.myLinks.createLinkModal.description'),
      content: <CreateLinkModal />,
      buttons: [
        {
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'create',
          label: t('buttons.create'),
          variant: 'solid',
          action: () => {
            const name = useGeneralStore.getState().createLinkModal.name;
            const destinationURL = useGeneralStore.getState().createLinkModal.destinationURL;
            const setName = useGeneralStore.getState().createLinkModal.setName;
            const setDestinationURL = useGeneralStore.getState().createLinkModal.setDestinationURL;

            if (!name) return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.emptyName'));

            const nameRegex = /^[a-zA-Z0-9-_]+$/;
            if (!nameRegex.test(name)) return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.invalidName'));
            if (name.length > 20) return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.nameTooLong', { maxLength: 20 }));

            if (!destinationURL) return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.emptyDestinationURL'));

            try {
              const parsedURL = new URL(destinationURL);
              if (parsedURL.protocol !== 'https:') return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.destinationUrlNotHTTPS'));
              if (parsedURL.port) return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.destinationUrlHavePort'));
              
              disableButton('create-link', 'create');

              toast.promise(createLink({ name, destinationURL }), {
                loading: t('accountPage.tabs.myLinks.createLinkModal.toast.creatingLink'),
                success: () => {
                  closeModal('create-link');
                  setName('');
                  setDestinationURL('');
                  fetchData(['links']);
                  
                  return t('accountPage.tabs.myLinks.createLinkModal.toast.linkCreated');
                },
                error: error => {
                  enableButton('create-link', 'create');
                  
                  return error;
                }
              });
            } catch {
              return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.invalidDestinationUrl'));
            }
          }
        }
      ]
    });
  }

  return (
    <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6 lg:mb-4'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='flex items-center text-xl font-bold gap-x-2 text-primary'>
          {t('accountPage.tabs.myLinks.title')}

          <span className='text-xs font-semibold text-tertiary'>
            {data.links?.length || 0}/{user?.premium?.createdAt ? 5 : 1}
          </span>
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myLinks.subtitle')}
        </p>
      </div>

      <div className='max-w-[800px] flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-2'>
          {canCreateNewLink ? (
            <div
              className='flex w-full gap-4 p-4 cursor-pointer rounded-3xl bg-secondary hover:bg-quaternary'
              onClick={continueCreateLink}
            >
              <LuPlus className='text-primary' size={20} />
            
              <span className='text-sm font-medium text-tertiary'>
                {t('buttons.newLink')}
              </span>
            </div>
          ) : (
            <div className='flex flex-col w-full p-4 mt-4 border border-yellow-500 rounded-xl bg-yellow-500/10 gap-y-2'>
              <h2 className='flex items-center font-bold mobile:text-lg gap-x-2 text-primary'>
                <PiWarningCircleFill /> {t('accountPage.tabs.myLinks.maximumLinksReachedInfo.title')}
              </h2>

              <p className='text-xs font-medium mobile:text-sm text-tertiary'>
                {t('accountPage.tabs.myLinks.maximumLinksReachedInfo.description', {
                  link: <Link href='/premium' className='text-secondary hover:text-primary'>{t('accountPage.tabs.myLinks.maximumLinksReachedInfo.linkText')}</Link>
                })}
              </p>
            </div>
          )}
        </div>

        {data.links?.length === 0 ? (
          <ErrorState 
            title={
              <div className='flex items-center mt-8 gap-x-2'>
                <BsEmojiAngry />
                {t('accountPage.tabs.myLinks.emptyErrorState.title')}
              </div>
            }
            message={t('accountPage.tabs.myLinks.emptyErrorState.message')}
          />
        ) : (
          data.links?.map(link => (
            <div 
              key={link.id}
              className='flex items-center gap-4 p-4 bg-secondary rounded-3xl hover:bg-quaternary'
            >
              <FiLink className='text-primary' size={20} />

              <span className='flex items-center w-full text-sm font-medium text-secondary'>
                dsc.ink/{link.name}

                <span className='sm:block hidden ml-2 text-xs font-medium truncate text-tertiary max-w-[70%]'>
                  ({link.redirectTo})
                </span>

                <div className='flex items-center ml-auto text-xs font-medium gap-x-2 text-tertiary'>
                  <span className='flex items-center gap-x-1'>
                    {t('accountPage.tabs.myLinks.visits', { count: link.visits })}
                  </span>

                  <CopyButton
                    successText='Link copied!'
                    copyText={`https://dsc.ink/${link.name}`}
                  >
                    <div className='cursor-pointer hover:opacity-70'>
                      <MdOutlineCopyAll size={15} />
                    </div>
                  </CopyButton>

                  <Link
                    href={link.redirectTo}
                    target='_blank'
                    rel='noreferrer'
                    className='hover:opacity-70'
                  >
                    <FiExternalLink size={15} />
                  </Link>

                  <button
                    className='hover:opacity-70'
                    onClick={() => 
                      openModal('delete-link', {
                        title: t('accountPage.tabs.myLinks.deleteLinkModal.title'),
                        description: t('accountPage.tabs.myLinks.deleteLinkModal.description'),
                        content: (
                          <p className='text-sm text-tertiary'>
                            {t('accountPage.tabs.myLinks.deleteLinkModal.note', { br: <br /> })}
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
                            action: () => continueDeleteLink(link.id)
                          }
                        ]
                      })
                    }
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}