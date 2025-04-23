'use client';

import { PiWarningCircleFill, MdOutlineCopyAll, LuPlus, FiExternalLink, FiLink, FiTrash2, BsEmojiAngry } from '@/icons';
import ErrorState from '@/app/components/ErrorState';
import useAuthStore from '@/stores/auth';
import useModalsStore from '@/stores/modals';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import deleteLink from '@/lib/request/links/deleteLink';
import { toast } from 'sonner';
import CreateLinkModal from '@/app/(account)/account/components/Content/Tabs/MyLinks/CreateLinkModal';
import useGeneralStore from '@/stores/general';
import createLink from '@/lib/request/links/createLink';
import useAccountStore from '@/stores/account';
import CopyButton from '@/app/components/CopyButton/CustomTrigger';
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
      error: () => enableButton('delete-link', 'confirm')
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
                error: () => enableButton('create-link', 'create')
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
                  link: <Link href='/premium' className='text-secondary hover:text-primary'>{t('accountPage.tabs.myLinks.maximumLinksReachedInfo.linkText')}</Link>
                })}
              </p>
            </div>
          )}
        </div>

        {data.links?.length === 0 ? (
          <ErrorState
            title={
              <div className='mt-8 flex items-center gap-x-2'>
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
              className='flex items-center gap-4 rounded-3xl bg-secondary p-4 hover:bg-quaternary'
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
    </>
  );
}