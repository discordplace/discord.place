'use client';

import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import checkSlugAvailability from '@/lib/request/profiles/checkSlugAvailability';
import useAuthStore from '@/stores/auth';
import useGeneralStore from '@/stores/general';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { useDebounce } from 'react-use';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { t } from '@/stores/language';

export default function CreateProfile() {
  const { preferredHost, setPreferredHost, slug, setSlug } = useGeneralStore(useShallow(state => ({
    preferredHost: state.createProfileModal.preferredHost,
    setPreferredHost: state.createProfileModal.setPreferredHost,
    slug: state.createProfileModal.slug,
    setSlug: state.createProfileModal.setSlug
  })));

  const user = useAuthStore(state => state.user);

  const [slugStatus, setSlugStatus] = useState('idle');
  const [debouncedSlug, setDebouncedSlug] = useState('');

  useDebounce(() => {
    setDebouncedSlug(slug);
  }, 500, [slug]);

  useEffect(() => {
    if (debouncedSlug === '') {
      setSlugStatus('idle');
      return;
    }

    if (debouncedSlug.length < 3) {
      setSlugStatus('unavailable');
      toast.error(t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.toast.slugTooShort', { minLength: 3 }));

      return;
    }

    if (!config.validateSlug(debouncedSlug)) {
      setSlugStatus('unavailable');
      toast.error(t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.toast.invalidSlug'));

      return;
    }
    
    setSlugStatus('loading');

    checkSlugAvailability(debouncedSlug)
      .then(available => {
        setSlugStatus(available ? 'available' : 'unavailable');
      })
      .catch(error => {
        toast.error(error);
        setSlugStatus('idle');
      });
      
  }, [debouncedSlug]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className='flex flex-col'>
        <div className='flex items-center gap-x-2'>
          <h2 className='text-sm font-semibold text-secondary'>
            {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.fields.host.title')}
          </h2>

          {!user.premium?.createdAt && (
            <Tooltip content={t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.tooltip.premiumRequired')}>
              <div>
                <FaCrown className='text-yellow-500' />
              </div>
            </Tooltip>
          )}
        </div>

        <p className='text-xs text-tertiary'>
          {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.fields.host.description')}
        </p>
            
        <div className="flex w-full mt-2">
          {['discord.place/p', ...config.customHostnames]
            .map(hostname => (
              <div
                onClick={() => setPreferredHost(hostname)}
                key={hostname}
                className={cn(
                  'w-full border select-none border-primary relative first:rounded-l-xl last:rounded-r-xl group px-3 py-2 font-medium text-center [&:not(:first)]:rounded-xl cursor-pointer hover:text-primary bg-quaternary hover:bg-secondary text-secondary',
                  preferredHost === hostname && 'pointer-events-none',
                  config.customHostnames.includes(hostname) && !user.premium?.createdAt && 'opacity-50 pointer-events-none'
                )}
              >
                {hostname}

                {preferredHost === hostname && (
                  <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full group-first:rounded-l-xl group-last:rounded-r-xl bg-secondary/80'>
                    <IoMdCheckmarkCircle className='text-primary' />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center gap-x-2'>
          <h2 className='text-sm font-semibold text-secondary'>
            {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.fields.slug.title')}
          </h2>

          {slugStatus !== 'idle' && (
            <div className={cn(
              'flex text-xs items-center gap-x-1 font-medium',
              slugStatus === 'available' && 'text-green-500',
              slugStatus === 'unavailable' && 'text-red-500',
              slugStatus === 'loading' && 'text-yellow-500'
            )}>
              {slugStatus === 'available' ? (
                <>
                  <IoMdCheckmarkCircle />
                  {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.status.available')}
                </>
              ) : (
                slugStatus === 'unavailable' ? (
                  <>
                    <IoMdCloseCircle />
                    {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.status.unavailable')}
                  </>
                ) : (
                  <>
                    <TbLoader className='animate-spin' />
                    {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.status.checking')}
                  </>
                )
              )}
            </div>
          )}
        </div>

        <p className='text-xs text-tertiary'>
          {t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.fields.slug.description')}
        </p>
            
        <input
          type="text"
          placeholder={t('accountPage.tabs.myAccount.sections.yourProfile.createProfileModal.fields.slug.placeholder')}
          className="w-full px-3 py-2 mt-2 text-sm transition-all outline-none placeholder-placeholder text-secondary bg-secondary hover:bg-background focus-visible:bg-background hover:ring-2 ring-purple-500 rounded-xl"
          value={slug}
          maxLength={32}
          onChange={event => setSlug(event.target.value)}
        />
      </div>
    </div>
  );
}