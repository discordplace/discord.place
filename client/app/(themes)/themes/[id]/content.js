'use client';

import { RiErrorWarningFill, LuShieldQuestion } from '@/icons';
import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import config from '@/config';
import FaQs from '@/app/(themes)/themes/[id]/components/FaQs';
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
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function Content({ theme }) {
  const language = useLanguageStore(state => state.language);
  const user = useAuthStore(state => state.user);
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
      error: () => enableButton('delete-theme', 'confirm')
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
              {t('themePage.notApprovedInfo.description', { link: <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>{t('themePage.notApprovedInfo.linkText')}</Link> })}
            </p>
          </div>
        )}

        <div className='flex size-full flex-col gap-4 lg:flex-row'>
          <div className='flex max-w-[325px]'>
            <ReportableArea
              key={theme.id}
              active={user?.id !== theme.publisher.id}
              type='theme'
              metadata={{
                id: theme.id,
                colors: theme.colors,
                publisher: theme.publisher
              }}
              identifier={`theme-${theme.id}`}
            >
              <ThemeCard
                primaryColor={theme.colors.primary}
                secondaryColor={theme.colors.secondary}
              />
            </ReportableArea>
          </div>

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
                      key={category}
                      className='flex select-none items-center gap-x-1 rounded-lg text-sm font-semibold text-tertiary'
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
                  href={`/profile/u/${theme.publisher.id}`}
                  className='flex items-center gap-x-1 text-sm font-semibold text-primary transition-opacity hover:opacity-70'
                >
                  <UserAvatar
                    id={theme.publisher.id}
                    hash={theme.publisher.avatar}
                    className='size-[20px] rounded-full'
                    width={32}
                    height={32}
                  />

                  @{theme.publisher.username}
                </Link>
              </div>
            </div>

            <div className='flex w-full flex-col gap-2 mobile:flex-row'>
              <CopyButton
                className='w-full'
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.primary })}
                copyText={theme.colors.primary}
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
                successText={t('themePage.themeDetails.colors.copied', { color: theme.colors.secondary })}
                copyText={theme.colors.secondary}
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