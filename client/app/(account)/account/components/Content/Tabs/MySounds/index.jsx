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
      <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
        <NewSound />
      </div>
    ) : (
      <div className='flex flex-col px-6 mt-16 lg:px-16 gap-y-6'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.mySounds.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.mySounds.subtitle')}
          </p>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.mySounds.sections.listedSounds.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.sounds?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.mySounds.sections.listedSounds.description')}
          </p>

          {(data.sounds || []).length === 0 ? (
            <div className='max-w-[800px] mt-20'>
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
            <div className='gap-4 max-w-[800px] mt-2 grid grid-cols-1 xl:grid-cols-2'>
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

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.mySounds.sections.newSound.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.mySounds.sections.newSound.description')}
          </p>

          <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill />  {t('accountPage.tabs.mySounds.sections.newSound.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.mySounds.sections.newSound.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.mySounds.sections.newSound.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
            <button
              className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
              onClick={() => setCurrentlyAddingSound(true)}
            >
              {t('buttons.letsGo')}
              <LuPlus />
            </button>
          </div>
        </div>
      </div>
    )
  );
}