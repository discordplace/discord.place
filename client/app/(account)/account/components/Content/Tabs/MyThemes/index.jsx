'use client';

import NewTheme from '@/app/(account)/account/components/Content/Tabs/MyThemes/NewTheme';
import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import ErrorState from '@/app/components/ErrorState';
import config from '@/config';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';

export default function MyThemes() {
  const { currentlyAddingTheme, data, setCurrentlyAddingTheme } = useAccountStore(useShallow(state => ({
    currentlyAddingTheme: state.currentlyAddingTheme,
    data: state.data,
    setCurrentlyAddingTheme: state.setCurrentlyAddingTheme
  })));

  return (
    currentlyAddingTheme ? (
      <NewTheme />
    ) : (
      <>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.myThemes.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.myThemes.subtitle')}
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myThemes.sections.listedThemes.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.themes?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myThemes.sections.listedThemes.subtitle')}
          </p>

          {(data.themes || []).length === 0 ? (
            <div className='mt-20 max-w-[800px]'>
              <ErrorState
                message={t('accountPage.tabs.myThemes.sections.listedThemes.emptyErrorState.message')}
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myThemes.sections.listedThemes.emptyErrorState.title')}
                  </div>
                }
              />
            </div>
          ) : (
            <div className='mt-2 grid max-w-[800px] grid-cols-1 gap-4 mobile:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
              {data.themes.map(theme => (
                <ThemeCard
                  id={theme.id}
                  key={theme.id}
                  primaryColor={theme.colors.primary}
                  secondaryColor={theme.colors.secondary}
                />
              ))}
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myThemes.sections.newTheme.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myThemes.sections.newTheme.subtitle')}
          </p>

          <div className='relative mt-2 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
              <BsQuestionCircleFill />  {t('accountPage.tabs.myThemes.sections.newTheme.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.myThemes.sections.newTheme.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myThemes.sections.newTheme.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='mt-4 flex flex-col gap-y-4 text-sm text-tertiary'>
            <button
              className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
              onClick={() => setCurrentlyAddingTheme(true)}
            >
              {t('buttons.letsGo')}
              <LuPlus />
            </button>
          </div>
        </div>
      </>
    )
  );
}