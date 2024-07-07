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
      loading: 'Link deleting..',
      success: () => {
        closeModal('delete-link');
        fetchData(['links']);
        
        return 'Successfully deleted the link.';
      },
      error: error => {
        enableButton('delete-link', 'confirm');
  
        return error;
      }
    });
  }

  function continueCreateLink() {
    openModal('create-link', {
      title: 'Create New Link',
      description: 'Create a new link to share with your audience.',
      content: <CreateLinkModal />,
      buttons: [
        {
          id: 'cancel',
          label: 'Cancel',
          variant: 'ghost',
          actionType: 'close'
        },
        {
          id: 'create',
          label: 'Create',
          variant: 'solid',
          action: () => {
            const name = useGeneralStore.getState().createLinkModal.name;
            const destinationURL = useGeneralStore.getState().createLinkModal.destinationURL;
            const setName = useGeneralStore.getState().createLinkModal.setName;
            const setDestinationURL = useGeneralStore.getState().createLinkModal.setDestinationURL;

            if (!name) return toast.error('Please enter a name for your link.');

            const nameRegex = /^[a-zA-Z0-9-_]+$/;
            if (!nameRegex.test(name)) return toast.error('Link name can only contain letters, numbers, hyphens, and underscores.');
            if (name.length > 20) return toast.error('Link name must be less than 20 characters.');

            if (!destinationURL) return toast.error('Please enter a destination URL for your link.');

            try {
              const parsedURL = new URL(destinationURL);
              if (parsedURL.protocol !== 'https:') return toast.error('Link destination must be a secure URL.');
              if (parsedURL.port) return toast.error('Link destination cannot have a port.');
              
              disableButton('create-link', 'create');

              toast.promise(createLink({ name, destinationURL }), {
                loading: 'Creating link..',
                success: () => {
                  closeModal('create-link');
                  setName('');
                  setDestinationURL('');
                  fetchData(['links']);
                  
                  return 'Successfully created the link.';
                },
                error: error => {
                  enableButton('create-link', 'create');
                  
                  return error;
                }
              });
            } catch {
              return toast.error('Please enter a valid URL.');
            }
          }
        }
      ]
    });
  }

  return (
    <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='flex items-center text-xl font-bold gap-x-2 text-primary'>
          My Links

          <span className='text-xs font-semibold text-tertiary'>
            {data.links?.length || 0}/{user?.premium?.createdAt ? 5 : 1}
          </span>
        </h1>

        <p className='text-sm text-secondary'>
          View or manage the links that you have created.
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
              New Link
              </span>
            </div>
          ) : (
            <div className='flex flex-col w-full p-4 mt-4 border border-yellow-500 rounded-xl bg-yellow-500/10 gap-y-2'>
              <h2 className='flex items-center font-bold mobile:text-lg gap-x-2 text-primary'>
                <PiWarningCircleFill /> Maximum Links Reached
              </h2>
              <p className='text-xs font-medium mobile:text-sm text-tertiary'>
                You have reached the maximum amount of links that you can create.<br />
                For more information about Premium, visit <Link href='/premium' className='text-secondary hover:text-primary'>Premium page</Link>.
              </p>
            </div>
          )}
        </div>

        {data.links?.length === 0 ? (
          <ErrorState 
            title={
              <div className='flex items-center mt-8 gap-x-2'>
                <BsEmojiAngry />
                It{'\''}s quiet in here...
              </div>
            }
            message={'You have not created any links.'}
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
                    {link.visits} Visits
                  </span>

                  <CopyButton
                    successText='Link copied!'
                    copyText={`https://dsc.ink/${link.name}`}
                  >
                    <MdOutlineCopyAll size={15} />
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
                        title: 'Delete Link',
                        description: 'Are you sure you want to delete?',
                        content: (
                          <p className='text-sm text-tertiary'>
                            Please note that deleting your link will remove all visits that your link has received.<br/><br/>
                            This action cannot be undone.
                          </p>
                        ),
                        buttons: [
                          {
                            id: 'cancel',
                            label: 'Cancel',
                            variant: 'ghost',
                            actionType: 'close'
                          },
                          {
                            id: 'confirm',
                            label: 'Confirm',
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