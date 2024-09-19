'use client';

import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import config from '@/config';
import { LuShieldQuestion } from 'react-icons/lu';
import FaQs from '@/app/(themes)/themes/[id]/components/FaQs';
import { motion } from 'framer-motion';
import { RiErrorWarningFill } from 'react-icons/ri';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next-nprogress-bar';
import deleteTheme from '@/lib/request/themes/deleteTheme';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import CopyButton from '@/app/components/CopyButton/CustomTrigger';
import { colord } from 'colord';

export default function Content({ theme }) {
  const language = useLanguageStore(state => state.language);
  const router = useRouter();

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteTheme() {
    disableButton('delete-theme', 'confirm');

    toast.promise(deleteTheme(theme.id), {
      loading: t('themePage.toast.deletingTheme', { id: theme.id }),
      success: () => {
        closeModal('delete-theme');
        setTimeout(() => router.push('/'), 3000);
        
        return t('themePage.toast.themeDeleted', { id: theme.id });
      },
      error: error => {
        enableButton('delete-theme', 'confirm');
        
        return error;
      }
    });
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex w-full max-w-[1000px] mt-48 mb-16 flex-col gap-y-4 px-4 lg:px-0'>
        {!theme.approved && (
          <div className='flex flex-col p-4 border border-yellow-500 gap-y-2 bg-yellow-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>
            
            <p className='text-sm font-medium text-tertiary'>
              {t('themePage.notApprovedInfo.description', { link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('themePage.notApprovedInfo.linkText')}</Link> })}
            </p>
          </div>
        )}

        <div className='flex flex-col w-full h-full gap-4 lg:flex-row'>
          <motion.div className='w-full flex lg:max-w-[400px]'>
            <ThemeCard
              id={theme.id}
              primaryColor={theme.colors.primary}
              secondaryColor={theme.colors.secondary}
            />
          </motion.div>

          <div className='flex flex-col flex-1 w-full gap-y-4'>
            <h2 className='text-xl font-semibold text-primary'>
              {t('themePage.themeDetails.title')}
            </h2>

            <div className='flex flex-col gap-y-2'>
              {/* <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.colors')}
                </span>

                <div className='flex items-center gap-4'>
                  <CopyButton
                    successText={t('themePage.themeDetails.colors.coped', { color: theme.colors.primary })}
                    copyText={theme.colors.primary}
                  >
                    <div className='flex items-center text-sm font-semibold transition-all rounded-lg cursor-pointer select-none hover:opacity-80 gap-x-2 text-tertiary'>
                      <span className='w-3 h-3 rounded-full' style={{ background: theme.colors.primary }} />
                    
                      {theme.colors.primary}
                    </div>
                  </CopyButton>

                  <CopyButton
                    successText={t('themePage.themeDetails.colors.coped', { color: theme.colors.secondary })}
                    copyText={theme.colors.secondary}
                  >
                    <div className='flex items-center text-sm font-semibold transition-all rounded-lg cursor-pointer select-none hover:opacity-80 gap-x-2 text-tertiary'>
                      <span className='w-3 h-3 rounded-full' style={{ background: theme.colors.secondary }} />
                    
                      {theme.colors.secondary}
                    </div>
                  </CopyButton>
                </div>
              </div> */}

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.uploadedAt')}
                </span>

                <span className='text-sm font-semibold text-primary'>
                  {new Date(theme.createdAt).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.categories')}
                </span>

                <div className='flex items-center gap-2'>
                  {theme.categories.map(category => (
                    <span
                      key={category}
                      className='flex items-center text-sm font-semibold rounded-lg select-none gap-x-1 text-tertiary'
                    >
                      {config.themeCategoriesIcons[category]}
                      {t(`categories.${category}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between w-full'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.publisher')}
                </span>

                <Link
                  href={`/profile/u/${theme.publisher.id}`}
                  className='flex items-center text-sm font-semibold transition-opacity gap-x-1 text-primary hover:opacity-70'
                >
                  <UserAvatar
                    id={theme.publisher.id}
                    hash={theme.publisher.avatar}
                    className='w-[20px] h-[20px] rounded-full'
                    width={32}
                    height={32}
                  />
                  
                  @{theme.publisher.username}
                </Link>
              </div>
            </div>

            <div className='flex flex-col w-full gap-2 mt-auto mobile:flex-row'>
              <CopyButton
                className='w-full'
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.primary })}
                copyText={theme.colors.primary}
              >
                <div
                  className='flex items-center justify-center w-full py-2 text-sm font-medium text-center transition-all rounded-lg cursor-pointer hover:opacity-80 gap-x-2'
                  style={{
                    background: colord(theme.colors.primary).alpha(0.08).toHex(),
                    border: `2px solid ${colord(theme.colors.primary).alpha(0.5).toHex()}`,
                    color: theme.colors.primary
                  }}
                >
                  <span
                    className='block w-4 h-4 rounded-full'
                    style={{ background: theme.colors.primary }}
                  />
                
                  {t('themePage.themeDetails.colors.copyPrimary')}
                </div>
              </CopyButton>

              <CopyButton
                className='w-full'
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.secondary })}
                copyText={theme.colors.secondary}
              >
                <div
                  className='flex items-center justify-center w-full py-2 text-sm font-medium text-center transition-all rounded-lg cursor-pointer hover:opacity-80 gap-x-2'
                  style={{
                    background: colord(theme.colors.secondary).alpha(0.08).toHex(),
                    border: `2px solid ${colord(theme.colors.secondary).alpha(0.5).toHex()}`,
                    color: theme.colors.secondary
                  }}
                >
                  <span
                    className='block w-4 h-4 rounded-full'
                    style={{ background: theme.colors.secondary }}
                  />

                  {t('themePage.themeDetails.colors.copySecondary')}
                </div>
              </CopyButton>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full gap-4 lg:flex-row'>          
          <div className='flex flex-col w-full gap-y-4'>
            <h2 className='flex items-center mt-4 text-lg font-semibold sm:text-xl gap-x-1'>
              <LuShieldQuestion />
              {t('themePage.frequentlyAskedQuestions.title')}
            </h2>

            <FaQs />
          </div>
        </div>

        {theme.permissions.canDelete && (
          <div className='flex flex-col p-4 mt-8 border border-red-500 gap-y-2 bg-red-500/10 rounded-xl'>
            <h1 className='text-lg text-primary flex items-center font-semibold gap-x-1.5'>
              <RiErrorWarningFill />
              {t('themePage.dangerZone.title')}
            </h1>
            
            <p className='text-sm font-medium text-tertiary'>
              {t('themePage.dangerZone.description')}
            </p>
            
            <div className='flex mt-1 gap-x-2'>
              <button 
                className='px-3 py-1 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70'
                onClick={() =>
                  openModal('delete-theme', {
                    title: t('themePage.dangerZone.deleteThemeModal.title'),
                    description: t('themePage.dangerZone.deleteThemeModal.description', { id: theme.id }),
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('themePage.dangerZone.deleteThemeModal.content')}
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
                        action: continueDeleteTheme
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