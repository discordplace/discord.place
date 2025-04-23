'use client';

import { TbLoader, PiWarningCircleFill, FaCrown } from '@/icons';
import { useEffect, useRef, useState } from 'react';
import cn from '@/lib/cn';
import editProfile from '@/lib/request/profiles/editProfile';
import { toast } from 'sonner';
import Socials from '@/app/(profiles)/profile/[slug]/edit/components/Socials';
import { AnimatePresence, motion } from 'framer-motion';
import config from '@/config';
import { useRouter } from 'next-nprogress-bar';
import GenderDropdown from '@/app/(profiles)/profile/[slug]/edit/components/Dropdown/Gender';
import PreferredHostDropdown from '@/app/(profiles)/profile/[slug]/edit/components/Dropdown/PreferredHost';
import Link from 'next/link';
import revalidateProfile from '@/lib/revalidate/profile';
import { HexAlphaColorPicker } from 'react-colorful';
import Tooltip from '@/app/components/Tooltip';
import CopyButtonCustomTrigger from '@/app/components/CopyButton/CustomTrigger';
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { t } from '@/stores/language';

extend([a11yPlugin]);

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
  const [colors, setColors] = useState(profileData.colors || { primary: '#000000', secondary: '#000000' });
  const [changedKeys, setChangedKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentlyEditingIndex === -1) return;
    setCurrentlyEditingValue(profile[canBeEditedKeys[currentlyEditingIndex]] || 'Unknown');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlyEditingIndex]);

  function editKey(key) {
    if (key === 'cardColors') {
      if (colors.primary === (profile.colors?.primary || '#000000') && colors.secondary === (profile.colors?.secondary || '#000000')) return toast.error('You didn\'t make a change.');

      setChangedKeys(oldChangedKeys => ({
        ...oldChangedKeys,
        colors
      }));

      setProfile(oldProfile => ({
        ...oldProfile,
        colors
      }));

      setCurrentlyEditingIndex(-1);

      return;
    }

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
      loading: t('editProfilePage.toast.updatingProfile'),
      success: newProfile => {
        setChangedKeys({});
        setProfile(newProfile);
        setUnchangedProfile(newProfile);

        if (Object.keys(changedKeys).includes('newSlug')) {
          setTimeout(() => router.push(config.getProfileURL(changedKeys['newSlug'], newProfile.preferredHost)), 3000);

          return t('editProfilePage.toast.profileUpdatedAndWillBeRedirected');
        } else {
          revalidateProfile(newProfile.slug);
          setLoading(false);

          return t('editProfilePage.toast.profileUpdated');
        }
      },
      error: () => setLoading(false)
    });
  }

  const bioValueSpanRef = useRef(null);

  function PremiumRequiredBlock() {
    return (
      <div className='mt-4 flex w-full flex-col gap-y-2 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4'>
        <h2 className='flex items-center gap-x-2 text-lg font-bold text-primary'>
          <PiWarningCircleFill /> {t('editProfilePage.premiumRequiredInfo.title')}
        </h2>

        <p className='text-sm font-medium text-tertiary'>
          {t('editProfilePage.premiumRequiredInfo.description', { link: <Link href='/premium' className='text-secondary hover:text-primary'>{t('editProfilePage.premiumRequiredInfo.linkText')}</Link> })}
        </p>
      </div>
    );
  }

  useEffect(() => {
    function handlePaste(event) {
      event.preventDefault();

      const text = event.clipboardData.getData('text/plain');

      // I know execCommand is deprecated but they not gonna remove it anytime soon
      // because all websites will break without it xd
      document.execCommand('insertText', false, text);
    }

    document.addEventListener('paste', handlePaste);

    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className='my-8 flex flex-col gap-y-4'>
      <AnimatePresence>
        {Object.keys(changedKeys).length > 0 && (
          <motion.div
            className='fixed bottom-4 flex h-[60px] w-full max-w-[650px] items-center justify-between rounded-full border border-green-700 bg-green-800/20 px-8 backdrop-blur-sm'
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
              {t('editProfilePage.unsavedChangesPopover.label')}
            </h1>

            <div className='flex gap-x-2'>
              <button
                className='rounded-lg px-4 py-1.5 text-sm font-semibold text-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-70 dark:text-white dark:hover:bg-white dark:hover:text-black' onClick={() => {
                  setChangedKeys({});
                  setProfile(unchangedProfile);
                }}
                disabled={loading}
              >
                {t('buttons.cancel')}
              </button>

              <button
                className='flex items-center gap-x-1.5 rounded-lg bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/70 hover:text-white disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                onClick={saveChangedKeys}
                disabled={loading}
              >
                {loading && <TbLoader className='animate-spin' />}
                {t('buttons.save')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex size-full flex-col gap-y-8 rounded-2xl bg-secondary p-6'>
        {canBeEditedKeys.map((key, index) => (
          <div className='flex flex-col justify-between gap-4 sm:flex-row' key={key}>
            <div className='flex w-full max-w-[80%] flex-1 flex-col gap-y-1'>
              <h2 className='flex items-center gap-x-2 font-medium text-tertiary'>
                {t(`editProfilePage.labels.${key}`)}

                {key === 'preferredHost' && (
                  <Tooltip
                    content={t('editProfilePage.tooltip.premiumRequired')}
                    side='right'
                  >
                    <div>
                      <FaCrown className='text-yellow-500' />
                    </div>
                  </Tooltip>
                )}
              </h2>

              {currentlyEditingIndex === index ? (
                key === 'bio' ? (
                  <span
                    autoFocus
                    autoComplete='off'
                    spellCheck='false'
                    disabled={loading}
                    contentEditable
                    suppressContentEditableWarning
                    onKeyUp={() => setCurrentlyEditingValue(bioValueSpanRef?.current?.innerText)}
                    ref={bioValueSpanRef}
                    className='max-h-[200px] w-full resize-none overflow-y-auto break-all rounded-md bg-tertiary px-2 py-1 font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary disabled:pointer-events-none disabled:opacity-70'
                  >
                    {profileData.bio}
                  </span>
                ) : key === 'gender' ? (
                  <GenderDropdown profile={profile} currentlyEditingValue={currentlyEditingValue} setCurrentlyEditingValue={setCurrentlyEditingValue} />
                ) : key === 'preferredHost' ? (
                  !profile.premium ? (
                    <PremiumRequiredBlock />
                  ) : (
                    <PreferredHostDropdown profile={profile} currentlyEditingValue={currentlyEditingValue} setCurrentlyEditingValue={setCurrentlyEditingValue} />
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
                    className='w-full rounded-md bg-tertiary px-2 py-1 font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary disabled:pointer-events-none disabled:opacity-70 sm:max-w-[200px]'
                  />
                )
              ) : (
                <p className='max-h-[300px] overflow-y-auto truncate whitespace-pre-wrap font-medium text-primary'>{profile[key] || 'Unknown'}</p>
              )}
            </div>

            <div className='flex gap-x-2'>
              {currentlyEditingIndex === index && (
                <button
                  className='h-max rounded-lg px-4 py-1.5 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
                  onClick={() => {
                    if (canBeEditedKeys[currentlyEditingIndex] === 'bio') setCurrentlyEditingValue(profile.bio);
                    setCurrentlyEditingIndex(-1);
                  }}
                  disabled={loading}
                >
                  {t('buttons.cancel')}
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
                {currentlyEditingIndex === index ? t('buttons.save') : t('buttons.edit')}
              </button>
            </div>
          </div>
        ))}

        <div className='flex flex-col justify-between gap-4 sm:flex-row'>
          <div className='flex w-full max-w-[80%] flex-1 flex-col gap-y-1'>
            <h2 className='flex items-center gap-x-2 font-medium text-tertiary'>
              {t('editProfilePage.labels.cardColors')}

              <Tooltip
                content={t('editProfilePage.tooltip.premiumRequired')}
                side='right'
              >
                <div>
                  <FaCrown className='text-yellow-500' />
                </div>
              </Tooltip>
            </h2>

            {currentlyEditingIndex === 'cardColors' ? (
              profile.premium ? (
                <div className='mt-2 flex gap-x-4'>
                  <div className='flex flex-col gap-y-2'>
                    <h2 className='flex items-center gap-x-2 text-sm font-medium text-secondary'>
                      {t('editProfilePage.cardColors.primary')}

                      <div className='size-3 rounded-full' style={{ backgroundColor: colors.primary || '#000000' }} />
                    </h2>

                    <div className='[&_.react-colorful\_\_alpha]:h-[10px] [&_.react-colorful\_\_alpha]:w-[120px] [&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:size-[10px] [&_.react-colorful]:size-[120px]'>
                      <HexAlphaColorPicker
                        color={colors.primary || '#000000'}
                        onChange={color => setColors(oldColors => ({ ...oldColors, primary: color }))}
                      />

                      <input
                        type='text'
                        value={colors.primary || '#000000'}
                        onChange={event => setColors(oldColors => ({ ...oldColors, primary: event.target.value }))}
                        className='mt-4 w-full max-w-[120px] rounded-md bg-tertiary px-2 py-1 text-sm font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary'
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-y-2'>
                    <h2 className='flex items-center gap-x-2 text-sm font-medium text-secondary'>
                      {t('editProfilePage.cardColors.secondary')}

                      <div className='size-3 rounded-full' style={{ backgroundColor: colors.secondary || '#000000' }} />
                    </h2>

                    <div className='[&_.react-colorful\_\_alpha]:h-[10px] [&_.react-colorful\_\_alpha]:w-[120px] [&_.react-colorful\_\_hue]:!h-[10px] [&_.react-colorful\_\_pointer]:size-[10px] [&_.react-colorful]:size-[120px]'>
                      <HexAlphaColorPicker
                        color={colors.secondary || '#000000'}
                        onChange={color => setColors(oldColors => ({ ...oldColors, secondary: color }))}
                      />

                      <input
                        type='text'
                        value={colors.secondary || '#000000'}
                        onChange={event => setColors(oldColors => ({ ...oldColors, secondary: event.target.value }))}
                        className='mt-4 w-full max-w-[120px] rounded-md bg-tertiary px-2 py-1 text-sm font-medium text-secondary outline-none placeholder:text-placeholder hover:bg-quaternary focus-visible:bg-quaternary'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <PremiumRequiredBlock />
              )
            ) : (
              <div className='mt-2 flex gap-x-4'>
                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-sm font-medium text-secondary'>
                    {t('editProfilePage.cardColors.primary')}
                  </h2>

                  <CopyButtonCustomTrigger
                    timeout={2000}
                    successText={t('editProfilePage.toast.colorCopied', { hex: profile.colors?.primary || '#000000' })}
                    copyText={profile.colors?.primary || '#000000'}
                  >
                    <div className='group relative flex h-12 w-20 cursor-pointer items-center justify-center'>
                      <div
                        style={{ backgroundColor: profile.colors?.primary || '#000000' }}
                        className='size-full rounded-lg'
                      />

                      <div
                        className={cn(
                          'absolute flex items-center justify-center text-xs font-semibold max-w-[50px] text-center transition-opacity duration-200 opacity-0 gap-x-2 group-hover:opacity-100',
                          colord(profile.colors?.primary || '#000000').isLight() ? 'text-black' : 'text-white'
                        )}
                      >
                        {t('editProfilePage.cardColors.copyColor', { hex: profile.colors?.primary || '#000000' })}
                      </div>
                    </div>
                  </CopyButtonCustomTrigger>
                </div>

                <div className='flex flex-col gap-y-2'>
                  <h2 className='text-sm font-medium text-secondary'>
                    {t('editProfilePage.cardColors.secondary')}
                  </h2>

                  <CopyButtonCustomTrigger
                    timeout={2000}
                    successText={t('editProfilePage.toast.colorCopied', { hex: profile.colors?.secondary || '#000000' })}
                    copyText={profile.colors?.secondary || '#000000'}
                  >
                    <div className='group relative flex h-12 w-20 cursor-pointer items-center justify-center'>
                      <div
                        style={{ backgroundColor: profile.colors?.secondary || '#000000' }}
                        className='size-full rounded-lg'
                      />

                      <div
                        className={cn(
                          'absolute flex items-center justify-center text-xs font-semibold max-w-[50px] text-center transition-opacity duration-200 opacity-0 gap-x-2 group-hover:opacity-100',
                          colord(profile.colors?.secondary || '#000000').isLight() ? 'text-black' : 'text-white'
                        )}
                      >
                        {t('editProfilePage.cardColors.copyColor', { hex: profile.colors?.secondary || '#000000' })}
                      </div>
                    </div>
                  </CopyButtonCustomTrigger>
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-x-2'>
            {currentlyEditingIndex === 'cardColors' && (
              <>
                <button
                  className='h-max rounded-lg px-4 py-1.5 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
                  onClick={() => setCurrentlyEditingIndex(-1)}
                  disabled={loading}
                >
                  {t('buttons.cancel')}
                </button>

                <button
                  className='flex h-max items-center gap-x-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70'
                  onClick={() => {
                    setLoading(true);

                    toast.promise(editProfile(profileData.slug, { colors: { primary: null, secondary: null } }), {
                      loading: t('editProfilePage.toast.resettingColors'),
                      success: newProfile => {
                        setLoading(false);

                        setProfile(oldProfile => ({
                          ...oldProfile,
                          colors: newProfile.colors
                        }));

                        setColors(oldColors => ({
                          ...oldColors,
                          secondary: newProfile.colors?.secondary || '#000000',
                          primary: newProfile.colors?.primary || '#000000'
                        }));

                        return t('editProfilePage.toast.colorsReset');
                      },
                      error: () => setLoading(false)
                    });
                  }}
                  disabled={loading}
                >
                  {loading && <TbLoader className='animate-spin' />}
                  {t('buttons.reset')}
                </button>
              </>
            )}

            <button
              className={cn(
                'h-max px-4 py-1.5 text-sm font-semibold rounded-lg disabled:opacity-70 disabled:pointer-events-none',
                currentlyEditingIndex === 'cardColors' ? 'text-white dark:text-black dark:bg-white bg-black hover:bg-black/70 dark:hover:bg-white/70' : 'text-secondary bg-tertiary hover:text-primary hover:bg-quaternary'
              )}
              onClick={() => {
                if (currentlyEditingIndex === 'cardColors') return editKey('cardColors');
                setCurrentlyEditingIndex('cardColors');
              }}
              disabled={loading}
            >
              {currentlyEditingIndex === 'cardColors' ? t('buttons.save') : t('buttons.edit')}
            </button>
          </div>
        </div>
      </div>

      <Socials profile={profile} />
    </div>
  );
}