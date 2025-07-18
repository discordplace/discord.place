'use client';

import { TbLoader, MdArrowOutward, FiX } from '@/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import addSocial from '@/lib/request/profiles/addSocial';
import deleteSocial from '@/lib/request/profiles/deleteSocial';
import { toast } from 'sonner';
import cn from '@/lib/cn';
import config from '@/config';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import revalidateProfile from '@/lib/revalidate/profile';
import { t } from '@/stores/language';
import getIcon from '@/lib/utils/profiles/getIcon';

export default function Socials({ profile }) {
  const [socials, setSocials] = useState(profile.socials);

  const typeRegexps = {
    instagram: /(?:http(?:s)?:\/\/)?(?:www\.)?instagram\.com\/([\w](?!.*?\.{2})[\w.]{1,28}[\w])/,
    x: /(?:http(?:s)?:\/\/)?(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/,
    twitter: /(?:http(?:s)?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    tiktok: /(?:http(?:s)?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_]+)/,
    facebook: /(?:http(?:s)?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/,
    steam: /(?:http(?:s)?:\/\/)?(?:www\.)?steamcommunity\.com\/id\/([a-zA-Z0-9_]+)/,
    github: /(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/,
    twitch: /(?:http(?:s)?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/,
    youtube: /(?:http(?:s)?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_]+)/,
    telegram: /(?:http(?:s)?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/,
    linkedin: /(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/,
    gitlab: /(?:http(?:s)?:\/\/)?(?:www\.)?gitlab\.com\/([a-zA-Z0-9_-]+)/,
    reddit: /(?:http(?:s)?:\/\/)?(?:www\.)?reddit\.com\/u\/([a-zA-Z0-9_-]+)/,
    mastodon: /(?:http(?:s)?:\/\/)?(?:www\.)?mastodon\.social\/@([a-zA-Z0-9_]+)/,
    bluesky: /(?:http(?:s)?:\/\/)?(?:www\.)?bsky\.app\/profile\/([a-zA-Z0-9_]+)/,
    custom: /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b/
  };

  const [currentlyAddingNewSocial, setCurrentlyAddingNewSocial] = useState(false);
  const [newSocialType, setNewSocialType] = useState('unknown');
  const [newSocialValue, setNewSocialValue] = useState('');

  useEffect(() => {
    const type = Object.keys(typeRegexps).find(type => typeRegexps[type].test(newSocialValue));
    if (type) return setNewSocialType(type);

    setNewSocialType('unknown');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSocialValue]);

  const [loading, setLoading] = useState(false);

  function saveNewSocial() {
    if (newSocialType === 'unknown') return toast.error(t('editProfilePage.toast.invalidUrl'));
    if (newSocialValue === '') return toast.error(t('editProfilePage.toast.emptyUrl'));

    setLoading(true);

    const isKnownType = Object.keys(typeRegexps).includes(newSocialType);
    if (isKnownType) {
      if (newSocialType === 'custom') {
        const regexp = typeRegexps['custom'];
        const match = newSocialValue.match(regexp);
        if (!match) return toast.error(t('editProfilePage.toast.invalidUrl'));

        toast.promise(addSocial(profile.slug, `https://${match[0]}`, 'custom'),
          {
            loading: t('editProfilePage.toast.socialAdding'),
            success: newSocials => {
              setCurrentlyAddingNewSocial(false);
              setNewSocialType('unknown');
              setNewSocialValue('');
              setLoading(false);
              setSocials(newSocials);
              revalidateProfile(profile.slug);

              return t('editProfilePage.toast.socialAdded');
            },
            error: error => {
              setLoading(false);

              return error;
            }
          }
        );
      } else {
        const regexp = typeRegexps[newSocialType];
        const match = newSocialValue.match(regexp);
        if (!match) return toast.error(t('editProfilePage.toast.invalidUrl'));

        const handle = match[1];
        toast.promise(addSocial(profile.slug, handle, newSocialType),
          {
            loading: t('editProfilePage.toast.socialMediaAdding'),
            success: newSocials => {
              setCurrentlyAddingNewSocial(false);
              setNewSocialType('unknown');
              setNewSocialValue('');
              setLoading(false);
              setSocials(newSocials);
              revalidateProfile(profile.slug);

              return t('editProfilePage.toast.socialMediaAdded');
            },
            error: error => {
              setLoading(false);

              return error;
            }
          }
        );
      }
    }
  }

  const [deletingSocialId, setDeletingSocialId] = useState(null);

  function deleteSelectedSocial(id) {
    setLoading(true);
    setDeletingSocialId(id);

    toast.promise(deleteSocial(profile.slug, id),
      {
        loading: t('editProfilePage.toast.deletingSocial'),
        success: newSocials => {
          setCurrentlyAddingNewSocial(false);
          setNewSocialType('unknown');
          setNewSocialValue('');
          setLoading(false);
          setDeletingSocialId(null);
          setSocials(newSocials);
          revalidateProfile(profile.slug);

          return t('editProfilePage.toast.socialDeleted');
        },
        error: error => {
          setLoading(false);
          setDeletingSocialId(null);

          return error;
        }
      }
    );
  }

  return (
    <div className='flex size-full flex-col rounded-2xl bg-secondary p-6'>
      <h2 className='font-medium text-tertiary'>
        {t('editProfilePage.socials.title')}
      </h2>

      <p className='font-medium text-primary'>
        {t('editProfilePage.socials.subtitle')}
      </p>

      <div className='mt-4 flex flex-wrap gap-4'>
        {socials.map(social => {
          const SocialIcon = getIcon(social.type);

          return (
            <div
              className='group flex w-full max-w-[calc(50%_-_1rem)] items-center justify-between gap-x-1 rounded-2xl border border-primary bg-secondary px-2 py-3 transition-colors hover:bg-tertiary'
              key={social.link}
            >
              <div className='flex items-center gap-x-2 text-sm text-tertiary transition-colors group-hover:text-primary'>
                <SocialIcon
                  className='text-tertiary'
                  size={20}
                />

                <span className='select-none font-semibold'>
                  {social.type === 'custom' ? getDisplayableURL(social.link) : social.handle}
                </span>
              </div>

              <div className='flex items-center gap-x-1'>
                <Link
                  className='text-tertiary opacity-0 transition-all hover:text-primary group-hover:opacity-100'
                  href={social.link}
                  target='_blank'
                >
                  <MdArrowOutward size={18} />
                </Link>

                <button
                  className='text-tertiary transition-all hover:text-primary disabled:pointer-events-none disabled:opacity-70'
                  onClick={() => deleteSelectedSocial(social._id)}
                  disabled={loading}
                >
                  {(loading && deletingSocialId === social._id) ? (
                    <TbLoader
                      className='animate-spin'
                      size={18}
                    />
                  ) : (
                    <FiX size={18} />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        <div
          className={cn(
            'transition-all [&:has(input:focus)]:bg-tertiary border border-primary w-full max-w-[calc(50%_-_1rem)] rounded-2xl px-2 py-3 text-sm font-semibold bg-secondary items-center justify-between gap-x-2',
            currentlyAddingNewSocial ? 'flex' : 'hidden'
          )}
        >
          <div className='flex w-full items-center gap-x-2'>
            {(() => {
              const Icon = getIcon(newSocialType);
              if (!Icon) return (
                <div className='h-[18px] w-[20px] rounded-lg bg-quaternary' />
              );

              return (
                <Icon
                  className='text-tertiary'
                  size={20}
                />
              );
            })()}

            <input
              type='text'
              value={newSocialValue}
              onChange={event => setNewSocialValue(event.target.value)}
              onKeyUp={event => event.key === 'Enter' && saveNewSocial()}
              autoFocus
              autoComplete='off'
              spellCheck='false'
              disabled={loading}
              className='w-full bg-transparent font-medium text-secondary outline-none disabled:pointer-events-none disabled:opacity-70'
            />
          </div>
        </div>

        <div
          className={cn(
            'w-full gap-x-4',
            currentlyAddingNewSocial ? 'flex' : 'hidden'
          )}
        >
          <button
            className='flex w-full max-w-[calc(50%_-_1rem)] items-center justify-center gap-x-2 rounded-2xl bg-tertiary py-3 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70' onClick={() => {
              setCurrentlyAddingNewSocial(false);
              setNewSocialType('unknown');
              setNewSocialValue('');
            }}
            disabled={loading}
          >
            {t('buttons.cancel')}
          </button>

          <button className='flex w-full max-w-[calc(50%_-_1rem)] items-center justify-center gap-x-2 rounded-2xl bg-tertiary py-3 text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70' onClick={saveNewSocial} disabled={loading}>
            {t('buttons.add')}
          </button>
        </div>

        {socials.length < config.profilesMaxSocialsLength && (
          <button
            className={cn(
              'flex w-full py-3 max-w-[calc(50%_-_1rem)] rounded-2xl justify-center text-sm font-semibold border-primary border hover:bg-tertiary hover:border-[rgb(var(--bg-tertiary))] items-center gap-x-2 text-secondary hover:text-primary disabled:pointer-events-none disabled:opacity-70',
              currentlyAddingNewSocial && 'hidden'
            )}
            onClick={() => setCurrentlyAddingNewSocial(true)}
            disabled={loading}
          >
            {t('buttons.addNew')}
          </button>
        )}
      </div>
    </div>
  );
}