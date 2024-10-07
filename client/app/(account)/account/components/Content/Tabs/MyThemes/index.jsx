'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import ThemeCard from '@/app/(themes)/themes/components/ThemeCard';
import NewTheme from '@/app/(account)/account/components/Content/Tabs/MyThemes/NewTheme';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

export default function MyThemes() {
  const { data, currentlyAddingTheme, setCurrentlyAddingTheme } = useAccountStore(useShallow(state => ({
    data: state.data,
    currentlyAddingTheme: state.currentlyAddingTheme,
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

        <div className='flex flex-col mt-8 gap-y-2'>
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
            <div className='max-w-[800px] mt-20'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myThemes.sections.listedThemes.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.myThemes.sections.listedThemes.emptyErrorState.message')}
              />
            </div>
          ) : (
            <div className='gap-4 max-w-[800px] mt-2 grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
              {data.themes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  id={theme.id}
                  primaryColor={theme.colors.primary}
                  secondaryColor={theme.colors.secondary}
                />
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myThemes.sections.newTheme.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myThemes.sections.newTheme.subtitle')}
          </p>

          <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill />  {t('accountPage.tabs.myThemes.sections.newTheme.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.myThemes.sections.newTheme.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myThemes.sections.newTheme.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
            <button
              className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
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