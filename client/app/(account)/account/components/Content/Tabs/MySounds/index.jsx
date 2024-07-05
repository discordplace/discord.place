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
            My Sounds
          </h1>

          <p className='text-sm text-secondary'>
            View sounds that you have listed on discord.place. You can also submit a new sound to discord.place.
          </p>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Listed Sounds

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.sounds?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            Here, you can see the sounds that you have listed on discord.place.
          </p>

          {(data.sounds || []).length === 0 ? (
            <div className='max-w-[800px] mt-20'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>
                }
                message={'You have not listed any sounds on discord.place.'}
              />
            </div>
          ) : (
            <div className='gap-4 max-w-[800px] mt-2 grid grid-cols-1 xl:grid-cols-2'>
              {data.sounds.map(sound => (
                <SoundPreview
                  key={sound.id}
                  sound={sound}
                />
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            New Sound
          </h2>

          <p className='text-sm text-tertiary'>
            Submit a new sound to discord.place.
          </p>

          <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill /> Note
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              Your submitted sound will be reviewed by our team before it is listed on discord.place. Please make sure that your sound is not violating our sound submission guidelines. Our sound submission guidelines can be found in our <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>Discord server</Link>.
            </p>
          </div>

          <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
            <button
              className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
              onClick={() => setCurrentlyAddingSound(true)}
            >
              Let{'\''}s go!
              <LuPlus />
            </button>
          </div>
        </div>
      </div>
    )
  );
}