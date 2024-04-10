'use client';

import { useEffect, useRef, useState } from 'react';
import cn from '@/lib/cn';
import fuc from '@/lib/fuc';
import editProfile from '@/lib/request/profiles/editProfile';
import { toast } from 'sonner';
import Socials from '@/app/(profiles)/profile/[slug]/edit/components/Socials';
import { TbLoader } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import config from '@/config';
import { useRouter } from 'next-nprogress-bar';
import GenderDropdown from '@/app/(profiles)/profile/[slug]/edit/components/Dropdown/Gender';
import PreferredHostDropdown from '@/app/(profiles)/profile/[slug]/edit/components/Dropdown/PreferredHost';
import Link from 'next/link';
import { PiWarningCircleFill } from 'react-icons/pi';

export default function Edit({ profileData }) { 
  const canBeEditedKeys = [
    'slug',
    'occupation',
    'gender',
    'location',
    'birthday',
    'bio',
    'preferredHost'
  ];

  const [unchangedProfile, setUnchangedProfile] = useState(profileData);
  const [profile, setProfile] = useState(profileData);
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(-1);
  const [currentlyEditingValue, setCurrentlyEditingValue] = useState('');
  const [changedKeys, setChangedKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    if (currentlyEditingIndex === -1) return;
    setCurrentlyEditingValue(profile[canBeEditedKeys[currentlyEditingIndex]] || 'Unknown');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyEditingIndex]);

  function editKey(key) {
    if (profile[key] === currentlyEditingValue) return toast.error('You didn\'t make a change.');
    setChangedKeys(oldChangedKeys => ({
      ...oldChangedKeys,
      [key === 'slug' ? 'newSlug' : key]: currentlyEditingValue
    }));
    setProfile(oldProfile => ({
      ...oldProfile,
      [key]: currentlyEditingValue
    }));
    setCurrentlyEditingIndex(-1);
  }

  function saveChangedKeys() {
    setLoading(true);

    toast.promise(editProfile(profileData.slug, changedKeys), {
      loading: 'Updating profile...',
      success: newProfile => {
        setChangedKeys({});
        setProfile(newProfile);
        setUnchangedProfile(newProfile);

        if (Object.keys(changedKeys).includes('newSlug')) {
          setTimeout(() => router.push(config.getProfileURL(changedKeys['newSlug'], newProfile.preferredHost)), 3000);
          return 'Profile updated! You will be redirected to new profile in 3 seconds.';
        } else {
          setLoading(false);
          return 'Profile updated!';
        }
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  }

  const bioValueSpanRef = useRef(null);

  return (
    <div className='flex flex-col my-8 gap-y-4'>
      <AnimatePresence>
        {Object.keys(changedKeys).length > 0 && (
          <motion.div 
            className='items-center px-8 flex justify-between fixed bottom-4 max-w-[650px] w-full h-[60px] bg-green-800/20 border border-green-700 backdrop-blur-sm rounded-full'
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ 
              duration: 0.25,
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
          >
            <h1 className='text-lg font-medium text-primary'>
              Beep beep! You have unsaved changes.
            </h1>
            <div className='flex gap-x-2'>
              <button className='px-4 py-1.5 text-sm font-semibold rounded-lg disabled:opacity-70 disabled:pointer-events-none text-black dark:text-white hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white' onClick={() => {
                setChangedKeys({});
                setProfile(unchangedProfile);
              }} disabled={loading}>
                Cancel
              </button>
              <button className='flex items-center gap-x-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg disabled:opacity-70 disabled:pointer-events-none text-white dark:text-black dark:bg-white bg-black hover:bg-black/70 dark:hover:bg-white/70 hover:text-white' onClick={saveChangedKeys} disabled={loading}>
                {loading && <TbLoader className='animate-spin' />}
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className='flex flex-col w-full h-full p-6 rounded-2xl bg-secondary gap-y-8'>
        {canBeEditedKeys.map((key, index) => (
          <div className='flex flex-col justify-between gap-4 sm:flex-row' key={key}>
            <div className='flex flex-col flex-1 w-full gap-y-1 max-w-[80%]'>
              <h2 className='font-medium text-tertiary'>{key === 'preferredHost' ? 'Preferred Host' : fuc(key)}</h2>
              {currentlyEditingIndex === index ? (
                key === 'bio' ? (
                  <span
                    autoFocus
                    autoComplete='off'
                    spellCheck='false'
                    disabled={loading}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyUp={() => setCurrentlyEditingValue(bioValueSpanRef?.current?.textContent)}
                    ref={bioValueSpanRef}
                    className='w-full break-all overflow-y-auto max-h-[200px] px-2 py-1 font-medium rounded-md outline-none resize-none disabled:pointer-events-none disabled:opacity-70 text-secondary placeholder-placeholder bg-tertiary hover:bg-quaternary focus-visible:bg-quaternary'
                  >
                    {profileData.bio}
                  </span>
                ) : key === 'gender' ? (
                  <GenderDropdown profile={profile} currentlyEditingValue={currentlyEditingValue} setCurrentlyEditingValue={setCurrentlyEditingValue} />
                ) : key === 'preferredHost' ? (
                  !profile.premium ? (
                    <>
                      <div className='flex flex-col w-full p-4 mt-4 border border-yellow-500 rounded-xl bg-yellow-500/10 gap-y-2'>
                        <h2 className='flex items-center text-lg font-bold gap-x-2 text-primary'>
                          <PiWarningCircleFill /> You can{'\''}t do that!
                        </h2>
                        <p className='text-sm font-medium text-tertiary'>
                          You have to be Premium to change that. For more information about Premium prices, you can come to <Link target='_blank' href={config.supportInviteUrl} className='text-secondary hover:text-primary'>our support server</Link> to contact us.
                        </p>
                      </div>
                    </>
                  ) : (
                    <PreferredHostDropdown  profile={profile} currentlyEditingValue={currentlyEditingValue} setCurrentlyEditingValue={setCurrentlyEditingValue} />
                  )
                ) : (
                  <input
                    type='text'
                    value={currentlyEditingValue}
                    onChange={event => setCurrentlyEditingValue(event.target.value)}
                    onKeyUp={event => event.key === 'Enter' && editKey(canBeEditedKeys[currentlyEditingIndex])}
                    autoFocus
                    autoComplete='off'
                    spellCheck='false'
                    disabled={loading}
                    className='sm:max-w-[200px] w-full px-2 py-1 font-medium rounded-md outline-none disabled:pointer-events-none disabled:opacity-70 text-secondary placeholder-placeholder bg-tertiary hover:bg-quaternary focus-visible:bg-quaternary'
                  />
                )
              ) : (
                <p className='font-medium whitespace-pre-wrap text-primary max-h-[300px] overflow-y-auto truncate'>{profile[key] || 'Unknown'}</p>
              )}
            </div>

            <div className='flex gap-x-2'>
              {currentlyEditingIndex === index && (
                <button 
                  className='h-max px-4 py-1.5 text-sm font-semibold rounded-lg text-secondary hover:text-primary hover:bg-quaternary disabled:opacity-70 disabled:pointer-events-none'
                  onClick={() => {
                    if (canBeEditedKeys[currentlyEditingIndex] === 'bio') setCurrentlyEditingValue(profile.bio);
                    setCurrentlyEditingIndex(-1);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button 
                className={cn(
                  'h-max px-4 py-1.5 text-sm font-semibold rounded-lg disabled:opacity-70 disabled:pointer-events-none',
                  currentlyEditingIndex === index ? 'text-white dark:text-black dark:bg-white bg-black hover:bg-black/70 dark:hover:bg-white/70' : 'text-secondary bg-tertiary hover:text-primary hover:bg-quaternary'
                )} 
                onClick={() => {
                  if (currentlyEditingIndex === index) return editKey(canBeEditedKeys[currentlyEditingIndex]);
                  setCurrentlyEditingIndex(index);
                }}
                disabled={loading}
              >
                {currentlyEditingIndex === index ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Socials profile={profile} />
    </div>
  );
}
