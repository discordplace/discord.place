'use client';

import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';
import AnimatedCount from '@/app/components/AnimatedCount';
import config from '@/config';
import { LuShieldQuestion } from 'react-icons/lu';
import FaQs from '@/app/(sounds)/sounds/[id]/components/FaQs';
import { motion } from 'framer-motion';
import { RiErrorWarningFill } from 'react-icons/ri';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import deleteSound from '@/lib/request/sounds/deleteSound';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ sound }) {
  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteSound() {
    disableButton('delete-sound', 'confirm');

    toast.promise(deleteSound(sound.id), {
      loading: `${sound.name} is deleting..`,
      success: () => {
        closeModal('delete-sound');
        setTimeout(() => router.push('/'), 3000);
        
        return `${sound.name} successfully deleted. You will be redirected to home page after 3 seconds.`;
      },
      error: error => {
        enableButton('delete-sound', 'confirm');
        
        return error;
      }
    });
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex w-full max-w-[1000px] mt-48 mb-16 flex-col gap-y-4 px-4 lg:px-0'>
        {!sound.approved && (
          <div className='flex flex-col p-4 border border-yellow-500 gap-y-2 bg-yellow-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>
            <p className='text-sm font-medium text-tertiary'>
              For the moment, only you can see the sound. Once the sound is approved, it will become public. Until then, you can come to <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>our support server</Link> and get a notification from our bot when your sound is approved. Make sure you open your DMs.
            </p>
          </div>
        )}

        <div className='flex flex-col w-full h-full gap-4 lg:flex-row'>
          <motion.div className='w-full lg:max-w-[400px]'>
            <SoundPreview
              sound={sound}
              showUploadToGuildButton={true}
            />
          </motion.div>

          <div className='flex flex-col flex-1 w-full gap-y-4'>
            <h2 className='text-xl font-semibold text-primary'>
              About {sound.name}
            </h2>

            <div className='flex flex-col gap-y-2'>
              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>Uploaded At</span>

                <span className='text-sm font-semibold text-primary'>
                  {new Date(sound.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>Downloads</span>

                <span className='text-sm font-semibold text-primary'>
                  <AnimatedCount data={sound.downloadsCount} />
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>Likes</span>

                <span className='text-sm font-semibold text-primary'>
                  <AnimatedCount data={sound.likesCount} />
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>Categories</span>

                <div className='flex items-center gap-2'>
                  {sound.categories.map(category => (
                    <span
                      key={category}
                      className='flex items-center text-sm font-semibold rounded-lg select-none gap-x-1 text-tertiary'
                    >
                      {config.soundCategoriesIcons[category]}
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>Publisher</span>

                <Link
                  href={`/profile/u/${sound.publisher.id}`}
                  className='flex items-center text-sm font-semibold transition-opacity gap-x-1 text-primary hover:opacity-70'
                >
                  @{sound.publisher.username}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full gap-4 lg:flex-row'>          
          <div className='flex flex-col w-full gap-y-4'>
            <h2 className='flex items-center mt-4 text-lg font-semibold sm:text-xl gap-x-1'>
              <LuShieldQuestion />
              Frequently Asked Questions
            </h2>

            <FaQs sound={sound} />
          </div>
        </div>

        {sound.permissions.canDelete && (
          <div className='flex flex-col p-4 mt-8 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Danger Zone
            </h1>
            <p className='text-sm font-medium text-tertiary'>
              You can delete the sound using the button below, but be careful not to delete it by mistake :)
            </p>
            
            <div className='flex mt-1 gap-x-2'>
              <button 
                className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
                onClick={() =>
                  openModal('delete-sound', {
                    title: 'Delete Sound',
                    description: `Are you sure you want to delete ${sound.name}?`,
                    content: (
                      <p className='text-sm text-tertiary'>
                        Please note that deleting the sound will remove all the downloads that the sound has received.<br/><br/>
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
                        action: continueDeleteSound
                      }
                    ]
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}