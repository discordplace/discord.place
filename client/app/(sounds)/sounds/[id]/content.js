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
import useLanguageStore, { t } from '@/stores/language';

export default function Content({ sound }) {
  const language = useLanguageStore(state => state.language);
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
      loading: t('soundPage.toast.deletingSound', { soundName: sound.name }),
      success: () => {
        closeModal('delete-sound');
        setTimeout(() => router.push('/'), 3000);
        
        return t('soundPage.toast.soundDeleted', { soundName: sound.name });
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
              {t('soundPage.notApprovedInfo.description', { link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('soundPage.notApprovedInfo.linkText')}</Link> })}
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
              {t('soundPage.soundDetails.title', { soundName: sound.name })}
            </h2>

            <div className='flex flex-col gap-y-2'>
              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('soundPage.soundDetails.fields.uploadedAt')}
                </span>

                <span className='text-sm font-semibold text-primary'>
                  {new Date(sound.createdAt).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('soundPage.soundDetails.fields.downloads')}
                </span>

                <span className='text-sm font-semibold text-primary'>
                  <AnimatedCount data={sound.downloadsCount} />
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('soundPage.soundDetails.fields.likes')}
                </span>

                <span className='text-sm font-semibold text-primary'>
                  <AnimatedCount data={sound.likesCount} />
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('soundPage.soundDetails.fields.categories')}
                </span>

                <div className='flex items-center gap-2'>
                  {sound.categories.map(category => (
                    <span
                      key={category}
                      className='flex items-center text-sm font-semibold rounded-lg select-none gap-x-1 text-tertiary'
                    >
                      {config.soundCategoriesIcons[category]}
                      {t(`categories.${category}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('soundPage.soundDetails.fields.publisher')}
                </span>

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
              {t('soundPage.frequentlyAskedQuestions.title')}
            </h2>

            <FaQs sound={sound} />
          </div>
        </div>

        {sound.permissions.canDelete && (
          <div className='flex flex-col p-4 mt-8 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              {t('soundPage.dangerZone.title')}
            </h1>
            
            <p className='text-sm font-medium text-tertiary'>
              {t('soundPage.dangerZone.description')}
            </p>
            
            <div className='flex mt-1 gap-x-2'>
              <button 
                className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
                onClick={() =>
                  openModal('delete-sound', {
                    title: t('soundPage.dangerZone.deleteSoundModal.title'),
                    description: t('soundPage.dangerZone.deleteSoundModal.description', { soundName: sound.name }),
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('soundPage.dangerZone.deleteSoundModal.content', { br: <br /> })}
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
                        label: t('buttons.delete'),
                        variant: 'solid',
                        action: continueDeleteSound
                      }
                    ]
                  })
                }
              >
                {t('buttons.delete')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}