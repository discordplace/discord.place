'use client';

import FaQs from '@/app/(themes)/themes/[id]/components/FaQs';
import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import CopyButton from '@/app/components/CopyButton/CustomTrigger';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import config from '@/config';
import deleteTheme from '@/lib/request/themes/deleteTheme';
import useLanguageStore, { t } from '@/stores/language';
import useModalsStore from '@/stores/modals';
import { colord } from 'colord';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { LuShieldQuestion } from 'react-icons/lu';
import { RiErrorWarningFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function Content({ theme }) {
  const language = useLanguageStore(state => state.language);
  const router = useRouter();

  const { closeModal, disableButton, enableButton, openModal } = useModalsStore(useShallow(state => ({
    closeModal: state.closeModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    openModal: state.openModal
  })));

  function continueDeleteTheme() {
    disableButton('delete-theme', 'confirm');

    toast.promise(deleteTheme(theme.id), {
      error: error => {
        enableButton('delete-theme', 'confirm');

        return error;
      },
      loading: t('themePage.toast.deletingTheme', { id: theme.id }),
      success: () => {
        closeModal('delete-theme');
        setTimeout(() => router.push('/'), 3000);

        return t('themePage.toast.themeDeleted', { id: theme.id });
      }
    });
  }

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='mb-16 mt-48 flex w-full max-w-[1000px] flex-col gap-y-4 px-4 lg:px-0'>
        {!theme.approved && (
          <div className='flex flex-col gap-y-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              Beep beep!
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('themePage.notApprovedInfo.description', { link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('themePage.notApprovedInfo.linkText')}</Link> })}
            </p>
          </div>
        )}

        <div className='flex size-full flex-col gap-4 lg:flex-row'>
          <motion.div className='flex w-full lg:max-w-[400px]'>
            <ThemeCard
              id={theme.id}
              primaryColor={theme.colors.primary}
              secondaryColor={theme.colors.secondary}
            />
          </motion.div>

          <div className='flex w-full flex-1 flex-col gap-y-4'>
            <h2 className='text-xl font-semibold text-primary'>
              {t('themePage.themeDetails.title')}
            </h2>

            <div className='flex flex-col gap-y-2'>
              <div className='flex w-full items-center justify-between'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.uploadedAt')}
                </span>

                <span className='text-sm font-semibold text-primary'>
                  {new Date(theme.createdAt).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div className='flex w-full items-center justify-between'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.categories')}
                </span>

                <div className='flex items-center gap-2'>
                  {theme.categories.map(category => (
                    <span
                      className='flex select-none items-center gap-x-1 rounded-lg text-sm font-semibold text-tertiary'
                      key={category}
                    >
                      {config.themeCategoriesIcons[category]}
                      {t(`categories.${category}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div className='flex w-full items-center justify-between'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('themePage.themeDetails.fields.publisher')}
                </span>

                <Link
                  className='flex items-center gap-x-1 text-sm font-semibold text-primary transition-opacity hover:opacity-70'
                  href={`/profile/u/${theme.publisher.id}`}
                >
                  <UserAvatar
                    className='size-[20px] rounded-full'
                    hash={theme.publisher.avatar}
                    height={32}
                    id={theme.publisher.id}
                    width={32}
                  />

                  @{theme.publisher.username}
                </Link>
              </div>
            </div>

            <div className='mt-auto flex w-full flex-col gap-2 mobile:flex-row'>
              <CopyButton
                className='w-full'
                copyText={theme.colors.primary}
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.primary })}
              >
                <div
                  className='flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg py-2 text-center text-sm font-medium text-primary transition-all hover:opacity-80'
                  style={{
                    background: colord(theme.colors.primary).alpha(0.08).toHex(),
                    border: `2px solid ${colord(theme.colors.primary).alpha(0.5).toHex()}`
                  }}
                >
                  <span
                    className='block size-4 rounded-full'
                    style={{ background: theme.colors.primary }}
                  />

                  {t('themePage.themeDetails.colors.copyPrimary')}
                </div>
              </CopyButton>

              <CopyButton
                className='w-full'
                copyText={theme.colors.secondary}
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.secondary })}
              >
                <div
                  className='flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg py-2 text-center text-sm font-medium text-primary transition-all hover:opacity-80'
                  style={{
                    background: colord(theme.colors.secondary).alpha(0.08).toHex(),
                    border: `2px solid ${colord(theme.colors.secondary).alpha(0.5).toHex()}`
                  }}
                >
                  <span
                    className='block size-4 rounded-full'
                    style={{ background: theme.colors.secondary }}
                  />

                  {t('themePage.themeDetails.colors.copySecondary')}
                </div>
              </CopyButton>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 lg:flex-row'>
          <div className='flex w-full flex-col gap-y-4'>
            <h2 className='mt-4 flex items-center gap-x-1 text-lg font-semibold sm:text-xl'>
              <LuShieldQuestion />
              {t('themePage.frequentlyAskedQuestions.title')}
            </h2>

            <FaQs />
          </div>
        </div>

        {theme.permissions.canDelete && (
          <div className='mt-8 flex flex-col gap-y-2 rounded-xl border border-red-500 bg-red-500/10 p-4'>
            <h1 className='flex items-center gap-x-1.5 text-lg font-semibold text-primary'>
              <RiErrorWarningFill />
              {t('themePage.dangerZone.title')}
            </h1>

            <p className='text-sm font-medium text-tertiary'>
              {t('themePage.dangerZone.description')}
            </p>

            <div className='mt-1 flex gap-x-2'>
              <button
                className='w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                onClick={() =>
                  openModal('delete-theme', {
                    buttons: [
                      {
                        actionType: 'close',
                        id: 'cancel',
                        label: t('buttons.cancel'),
                        variant: 'ghost'
                      },
                      {
                        action: continueDeleteTheme,
                        id: 'confirm',
                        label: t('buttons.delete'),
                        variant: 'solid'
                      }
                    ],
                    content: (
                      <p className='text-sm text-tertiary'>
                        {t('themePage.dangerZone.deleteThemeModal.content')}
                      </p>
                    ),
                    description: t('themePage.dangerZone.deleteThemeModal.description', { id: theme.id }),
                    title: t('themePage.dangerZone.deleteThemeModal.title')
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