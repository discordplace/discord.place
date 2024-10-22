'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';
import NewSound from '@/app/(account)/account/components/Content/Tabs/MySounds/NewSound';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

export default function MySounds() {
  const { data, currentlyAddingSound, setCurrentlyAddingSound } = useAccountStore(useShallow(state => ({
    data: state.data,
    currentlyAddingSound: state.currentlyAddingSound,
    setCurrentlyAddingSound: state.setCurrentlyAddingSound
  })));

  return (
    currentlyAddingSound ? (
      <NewSound />
    ) : (
      <>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.mySounds.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.mySounds.subtitle')}
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.mySounds.sections.listedSounds.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.sounds?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.mySounds.sections.listedSounds.subtitle')}
          </p>

          {(data.sounds || []).length === 0 ? (
            <div className='mt-20 max-w-[800px]'>
              <ErrorState
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.mySounds.sections.listedSounds.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.mySounds.sections.listedSounds.emptyErrorState.message')}
              />
            </div>
          ) : (
            <div className='mt-2 grid max-w-[800px] grid-cols-1 gap-4 xl:grid-cols-2'>
              {data.sounds.map(sound => (
                <SoundPreview
                  key={sound.id}
                  sound={sound}
                  overridedSort='Newest'
                />
              ))}
            </div>
          )}
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.mySounds.sections.newSound.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.mySounds.sections.newSound.subtitle')}
          </p>

          <div className='relative mt-2 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
              <BsQuestionCircleFill />  {t('accountPage.tabs.mySounds.sections.newSound.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.mySounds.sections.newSound.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.mySounds.sections.newSound.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='mt-4 flex flex-col gap-y-4 text-sm text-tertiary'>
            <button
              className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
              onClick={() => setCurrentlyAddingSound(true)}
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