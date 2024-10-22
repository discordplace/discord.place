'use client';

import CreateLinkModal from '@/app/(account)/account/components/Content/Tabs/MyLinks/CreateLinkModal';
import CopyButton from '@/app/components/CopyButton/CustomTrigger';
import ErrorState from '@/app/components/ErrorState';
import createLink from '@/lib/request/links/createLink';
import deleteLink from '@/lib/request/links/deleteLink';
import useAccountStore from '@/stores/account';
import useAuthStore from '@/stores/auth';
import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { FiExternalLink, FiLink, FiTrash2 } from 'react-icons/fi';
import { LuPlus } from 'react-icons/lu';
import { MdOutlineCopyAll } from 'react-icons/md';
import { PiWarningCircleFill } from 'react-icons/pi';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function MyLinks() {
  const user = useAuthStore(state => state.user);
  const fetchData = useAccountStore(state => state.fetchData);
  const data = useAccountStore(state => state.data);

  const canCreateNewLink = user?.premium?.createdAt ?
    data.links?.length < 5 : data.links?.length < 1;

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  function continueDeleteLink(id) {
    disableButton('delete-link', 'confirm');

    toast.promise(deleteLink(id), {
      error: error => {
        enableButton('delete-link', 'confirm');

        return error;
      },
      loading: t('accountPage.tabs.myLinks.toast.deletingLink'),
      success: () => {
        closeModal('delete-link');
        fetchData(['links']);

        return t('accountPage.tabs.myLinks.toast.linkDeleted');
      }
    });
  }

  function continueCreateLink() {
    openModal('create-link', {
      buttons: [
        {
          actionType: 'close',
          id: 'cancel',
          label: t('buttons.cancel'),
          variant: 'ghost'
        },
        {
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

              toast.promise(createLink({ destinationURL, name }), {
                error: error => {
                  enableButton('create-link', 'create');

                  return error;
                },
                loading: t('accountPage.tabs.myLinks.createLinkModal.toast.creatingLink'),
                success: () => {
                  closeModal('create-link');
                  setName('');
                  setDestinationURL('');
                  fetchData(['links']);

                  return t('accountPage.tabs.myLinks.createLinkModal.toast.linkCreated');
                }
              });
            } catch {
              return toast.error(t('accountPage.tabs.myLinks.createLinkModal.toast.invalidDestinationUrl'));
            }
          },
          id: 'create',
          label: t('buttons.create'),
          variant: 'solid'
        }
      ],
      content: <CreateLinkModal />,
      description: t('accountPage.tabs.myLinks.createLinkModal.description'),
      title: t('accountPage.tabs.myLinks.createLinkModal.title')
    });
  }

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        <h1 className='flex items-center gap-x-2 text-xl font-bold text-primary'>
          {t('accountPage.tabs.myLinks.title')}

          <span className='text-xs font-semibold text-tertiary'>
            {data.links?.length || 0}/{user?.premium?.createdAt ? 5 : 1}
          </span>
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myLinks.subtitle')}
        </p>
      </div>

      <div className='flex max-w-[800px] flex-col gap-y-4'>
        <div className='flex flex-col gap-y-2'>
          {canCreateNewLink ? (
            <div
              className='flex w-full cursor-pointer gap-4 rounded-3xl bg-secondary p-4 hover:bg-quaternary'
              onClick={continueCreateLink}
            >
              <LuPlus className='text-primary' size={20} />

              <span className='text-sm font-medium text-tertiary'>
                {t('buttons.newLink')}
              </span>
            </div>
          ) : (
            <div className='mt-4 flex w-full flex-col gap-y-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4'>
              <h2 className='flex items-center gap-x-2 font-bold text-primary mobile:text-lg'>
                <PiWarningCircleFill /> {t('accountPage.tabs.myLinks.maximumLinksReachedInfo.title')}
              </h2>

              <p className='text-xs font-medium text-tertiary mobile:text-sm'>
                {t('accountPage.tabs.myLinks.maximumLinksReachedInfo.description', {
                  link: <Link className='text-secondary hover:text-primary' href='/premium'>{t('accountPage.tabs.myLinks.maximumLinksReachedInfo.linkText')}</Link>
                })}
              </p>
            </div>
          )}
        </div>

        {data.links?.length === 0 ? (
          <ErrorState
            message={t('accountPage.tabs.myLinks.emptyErrorState.message')}
            title={
              <div className='mt-8 flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('accountPage.tabs.myLinks.emptyErrorState.title')}
              </div>
            }
          />
        ) : (
          data.links?.map(link => (
            <div
              className='flex items-center gap-4 rounded-3xl bg-secondary p-4 hover:bg-quaternary'
              key={link.id}
            >
              <FiLink className='text-primary' size={20} />

              <span className='flex w-full items-center text-sm font-medium text-secondary'>
                dsc.ink/{link.name}

                <span className='ml-2 hidden max-w-[70%] truncate text-xs font-medium text-tertiary sm:block'>
                  ({link.redirectTo})
                </span>

                <div className='ml-auto flex items-center gap-x-2 text-xs font-medium text-tertiary'>
                  <span className='hidden items-center gap-x-1 mobile:flex'>
                    {t('accountPage.tabs.myLinks.visits', { count: link.visits })}
                  </span>

                  <span className='flex items-center gap-x-1 mobile:hidden'>
                    {link.visits}
                  </span>

                  <CopyButton
                    copyText={`https://dsc.ink/${link.name}`}
                    successText='Link copied!'
                  >
                    <div className='cursor-pointer hover:opacity-70'>
                      <MdOutlineCopyAll size={15} />
                    </div>
                  </CopyButton>

                  <Link
                    className='hover:opacity-70'
                    href={link.redirectTo}
                    rel='noreferrer'
                    target='_blank'
                  >
                    <FiExternalLink size={15} />
                  </Link>

                  <button
                    className='hover:opacity-70'
                    onClick={() =>
                      openModal('delete-link', {
                        buttons: [
                          {
                            actionType: 'close',
                            id: 'cancel',
                            label: t('buttons.cancel'),
                            variant: 'ghost'
                          },
                          {
                            action: () => continueDeleteLink(link.id),
                            id: 'confirm',
                            label: t('buttons.confirm'),
                            variant: 'solid'
                          }
                        ],
                        content: (
                          <p className='text-sm text-tertiary'>
                            {t('accountPage.tabs.myLinks.deleteLinkModal.note', { br: <br /> })}
                          </p>
                        ),
                        description: t('accountPage.tabs.myLinks.deleteLinkModal.description'),
                        title: t('accountPage.tabs.myLinks.deleteLinkModal.title')
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
    </>
  );
}