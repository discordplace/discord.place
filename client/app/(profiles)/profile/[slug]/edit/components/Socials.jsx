'use client';

import { IoEarth } from 'react-icons/io5';
import { FaQuestion } from 'react-icons/fa6';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { useState, useEffect } from 'react';
import useThemeStore from '@/stores/theme';
import addSocial from '@/lib/request/profiles/addSocial';
import deleteSocial from '@/lib/request/profiles/deleteSocial';
import { toast } from 'sonner';
import { FiX } from 'react-icons/fi';
import cn from '@/lib/cn';
import config from '@/config';
import getDisplayableURL from '@/lib/utils/profiles/getDisplayableURL';
import getIconPath from '@/lib/utils/profiles/getIconPath';
import revalidateProfile from '@/lib/revalidate/profile';
import { t } from '@/stores/language';

export default function Socials({ profile }) {
  const [socials, setSocials] = useState(profile.socials);

  const colors = {
    instagram: '225 48 108',
    x: '0 0 0',
    twitter: '29 161 242',
    tiktok: '255 0 80',
    facebook: '66 103 178',
    steam: '0 0 0',
    github: '110 84 148',
    twitch: '145 70 255',
    youtube: '255 0 0',
    telegram: '36 161 222',
    custom: '150 150 150',
    unknown: '0 0 0'
  };

  const typeRegexps = {
    instagram: /(?:http(?:s)?:\/\/)?(?:www\.)?instagram\.com\/([\w](?!.*?\.{2})[\w.]{1,28}[\w])/,
    x: /(?:http(?:s)?:\/\/)?(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/,
    twitter: /(?:http(?:s)?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    tiktok: /(?:http(?:s)?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_]+)/,
    facebook: /(?:http(?:s)?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/,
    steam: /(?:http(?:s)?:\/\/)?(?:www\.)?steamcommunity\.com\/id\/([a-zA-Z0-9_]+)/,
    github: /(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_]+)/,
    twitch: /(?:http(?:s)?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/,
    youtube: /(?:http(?:s)?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_]+)/,
    telegram: /(?:http(?:s)?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/,
    custom: /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?\b/
  };

  const theme = useThemeStore(state => state.theme);

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
            error: message => {
              setLoading(false);

              return message;
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
            error: message => {
              setLoading(false);

              return message;
            }
          }
        );
      }
    }
  }

  function deleteSelectedSocial(id) {
    setLoading(true);

    toast.promise(deleteSocial(profile.slug, id),
      {
        loading: t('editProfilePage.toast.deletingSocial'),
        success: newSocials => {
          setCurrentlyAddingNewSocial(false);
          setNewSocialType('unknown');
          setNewSocialValue('');
          setLoading(false);
          setSocials(newSocials);
          revalidateProfile(profile.slug);

          return t('editProfilePage.toast.socialDeleted');
        },
        error: message => {
          setLoading(false);

          return message;
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
        {socials.map(social => (
          <div
            className='flex h-10 w-full max-w-[calc(50%_-_1rem)] items-center justify-between gap-x-2 rounded-lg border-2 border-[rgb(var(--brand-color)/0.5)] bg-gradient-to-r from-[rgb(var(--brand-color)/0.2)] px-2 text-sm font-semibold text-secondary'
            key={nanoid()}
            style={{
              '--brand-color': colors[social.type]
            }}
          >
            <div className='flex max-w-[90%] flex-auto gap-x-2'>
              {social.type === 'custom' ? (
                <>
                  <IoEarth className='flex-auto' size={20} />
                  <span className='w-full truncate'>
                    {getDisplayableURL(social.link)}
                  </span>
                </>
              ) : (
                <>
                  <Image
                    src={getIconPath(social.type, theme)}
                    width={20}
                    height={20}
                    alt={`${social.type} Icon`}
                    loading='lazy'
                  />

                  <span className='w-full truncate'>
                    {social.handle}
                  </span>
                </>
              )}
            </div>

            <div className='flex gap-x-1'>
              <button className='text-tertiary hover:text-primary disabled:pointer-events-none disabled:opacity-70' onClick={() => deleteSelectedSocial(social._id)} disabled={loading}>
                <FiX size={18} />
              </button>

              <Link className='text-tertiary hover:text-primary' href={social.link} target='_blank'>
                <MdArrowOutward size={18} />
              </Link>
            </div>
          </div>
        ))}

        <div
          className={cn(
            'transition-all w-full max-w-[calc(50%_-_1rem)] h-10 rounded-lg px-2 text-sm font-semibold bg-[rgb(var(--brand-color))]/10 items-center justify-between gap-x-2 text-secondary',
            currentlyAddingNewSocial ? 'flex' : 'hidden'
          )}
          style={{
            '--brand-color': colors[newSocialType]
          }}
        >
          <div className='flex w-full items-center gap-x-2'>
            {newSocialType === 'unknown' ? (
              <FaQuestion
                className='flex-auto'
                size={20}
              />
            ) : newSocialType === 'custom' ? (
              <IoEarth
                className='flex-auto'
                size={20}
              />
            ) : (
              <Image
                src={getIconPath(newSocialType, theme)}
                width={20}
                height={20}
                alt={`${newSocialType} Icon`}
                loading='lazy'
              />
            )}

            <input
              type='text'
              value={newSocialValue}
              onChange={event => setNewSocialValue(event.target.value)}
              onKeyUp={event => event.key === 'Enter' && saveNewSocial()}
              autoFocus
              autoComplete='off'
              spellCheck='false'
              disabled={loading}
              className='w-full bg-transparent font-medium text-secondary outline-none placeholder:text-placeholder disabled:pointer-events-none disabled:opacity-70'
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
            className='flex h-10 w-full max-w-[calc(50%_-_1rem)] items-center justify-center gap-x-2 rounded-lg bg-tertiary text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70' onClick={() => {
              setCurrentlyAddingNewSocial(false);
              setNewSocialType('unknown');
              setNewSocialValue('');
            }}
            disabled={loading}
          >
            {t('buttons.cancel')}
          </button>

          <button className='flex h-10 w-full max-w-[calc(50%_-_1rem)] items-center justify-center gap-x-2 rounded-lg bg-tertiary text-sm font-semibold text-secondary hover:bg-quaternary hover:text-primary disabled:pointer-events-none disabled:opacity-70' onClick={saveNewSocial} disabled={loading}>
            {t('buttons.add')}
          </button>
        </div>

        {socials.length < config.profilesMaxSocialsLength && (
          <button
            className={cn(
              'flex w-full max-w-[calc(50%_-_1rem)] h-10 rounded-lg justify-center text-sm font-semibold border-primary border hover:bg-tertiary hover:border-[rgb(var(--bg-tertiary))] items-center gap-x-2 text-secondary hover:text-primary disabled:pointer-events-none disabled:opacity-70',
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