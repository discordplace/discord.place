'use client';

import AuthProtected from '@/app/components/Providers/Auth/Protected';
import cn from '@/lib/cn';
import checkSlugAvailability from '@/lib/request/profiles/checkSlugAvailability';
import { Source_Serif_4 } from 'next/font/google';
const SourceSerif4 = Source_Serif_4({ subsets: ['latin'] });
import { useEffect, useRef, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { useDebounce } from 'react-use';
import { toast } from 'sonner';
import createProfile from '@/lib/request/profiles/createProfile';
import useAuthStore from '@/stores/auth';
import { redirect } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MdWorkspacePremium } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';

export default function Page() {
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user !== 'loading' && user !== null && user.profile) return redirect(`/profile/${user.profile.slug}`);
  }, [user]);

  const [slug, setSlug] = useState('');

  function handleOnChange(event) {
    const value = event.target.value;
    const trimmed = value.trim();
    if (trimmed.length === 1) {
      if (event.nativeEvent.inputType === 'insertText' && event.nativeEvent.data === '-') return;
      
      const slug = trimmed
        .replace(/[^a-zA-Z0-9-]/g, '')
        .replace(/-+/g, '-');
        
      if (slug === '') return;
    }
    
    if (event.nativeEvent.inputType === 'insertText' && event.nativeEvent.data === ' ') {
      if (trimmed.length > 1 && trimmed[trimmed.length - 1] !== '-') {
        const newValue = trimmed + '-';
        setSlug(newValue);
      }

      return;
    }

    const slug = trimmed
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-');

    setSlug(slug);
  }

  const [preferredHost, setPreferredHost] = useState('discord.place/p');
  const [slugIsAvailable, setSlugIsAvailable] = useState(null);
  const [slugAvailableLoading, setSlugAvailableLoading] = useState(false);
  const [debouncedSlug, setDebouncedSlug] = useState('');

  useDebounce(() => {
    setDebouncedSlug(slug);
  }, 500, [slug]);

  useEffect(() => {
    if (debouncedSlug === '') return setSlugIsAvailable(null);
    setSlugAvailableLoading(true);
    
    checkSlugAvailability(debouncedSlug)
      .then(available => setSlugIsAvailable(available))
      .catch(error => {
        toast.error(error);
        setSlugIsAvailable(null);
      })
      .finally(() => setSlugAvailableLoading(false));
  }, [debouncedSlug]);

  useEffect(() => {
    setSlugIsAvailable(null);
  }, [slug]);

  const [profileIsCreating, setProfileIsCreating] = useState(false);
  const timeoutRef = useRef(null);

  function continueProfileCreate() {
    setProfileIsCreating(true);

    toast.promise(createProfile(slug, preferredHost),
      {
        loading: 'Creating your profile..',
        success: () => {          
          timeoutRef.current = setTimeout(() => window.location.href = `/profile/${slug}`, 3000);

          return 'Profile created! In a few seconds, you will be redirected to your profile.';
        },
        error: message => {
          setProfileIsCreating(false);
          return message;
        }
      }
    );
  } 

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AuthProtected>
      <div className='flex items-center justify-center w-full h-[100dvh]'>
        <div className='max-w-[400px]'>
          <div className='z-10 flex flex-col items-center gap-y-2'>
            <h2 className={cn(
              'text-xl font-semibold text-center text-primary',
              SourceSerif4.className
            )}>
              Before we get started..
            </h2>
            <p className='text-lg text-center text-neutral-400'>
              Why not pick a slug for your profile?
            </p>

            <div className={cn(
              'w-full transition-all ease-in-out text-secondary mt-2',
              (setSlugAvailableLoading || slugIsAvailable === true || slugIsAvailable === false) ? 'opacity-100' : 'opacity-0',
              slugIsAvailable === true && 'text-green-700',
              slugIsAvailable === false && 'text-red-700'
            )}>
              {slugAvailableLoading ? 'Checking availability..' : (
                slugIsAvailable === true ? 'Slug is available!' : (
                  slugIsAvailable === false ? 'Slug is not available.' : 'Your Slug'
                )
              )}
            </div>

            <div className='flex'>
              <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                  <button className='w-max py-1.5 text-center bg-tertiary font-medium rounded-l-md text-secondary hover:text-primary hover:bg-quaternary min-w-[150px] outline-none'>
                    {preferredHost}/
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="flex flex-col p-4 min-w-[200px] bg-secondary rounded-xl border border-primary z-[9999] gap-y-2 mr-2 lg:mr-0 sm:mr-4" sideOffset={10}>
                    <div className='flex flex-col gap-y-2'>
                      <h2 className='text-base font-semibold select-none text-primary'>
                        Select a host
                      </h2>

                      <p className='text-xs text-tertiary max-w-[200px]'>
                        The host you choose will be used as a shortcut to your profile.
                      </p>

                      <div className='bg-quaternary w-full h-[1px]' />

                      <div className='flex flex-col gap-y-1.5'>
                        <DropdownMenu.Item className='outline-none' asChild onSelect={() => setPreferredHost('discord.place/p')}>
                          <button className={cn(
                            'flex items-center select-none justify-between px-2 py-1 text-sm border rounded-lg border-primary',
                            preferredHost === 'discord.place/p' ? 'pointer-events-none bg-quaternary text-primary' : 'hover:text-pretty text-secondary bg-tertiary hover:bg-quaternary'
                          )}>
                            discord.place/p
                          </button>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className='outline-none' asChild onSelect={() => setPreferredHost('dsc.wtf')}>
                          {user.premium ? (
                            <button className={cn(
                              'font-medium flex items-center select-none justify-between px-2 py-1 text-sm border rounded-lg border-primary',
                              preferredHost === 'dsc.wtf' ? 'pointer-events-none bg-quaternary text-primary' : 'hover:text-pretty text-secondary bg-tertiary hover:bg-quaternary'
                            )}>
                              dsc.wtf
                              <MdWorkspacePremium />
                            </button>
                          ) : (
                            <Tooltip content='Premium Only'>
                              <button className='flex items-center justify-between px-2 py-1 text-sm font-medium border border-yellow-500 rounded-lg cursor-default select-none text-secondary border-primary hover:bg-yellow-500/10 bg-yellow-500/10'>
                                dsc.wtf
                                <MdWorkspacePremium />
                              </button>
                            </Tooltip>
                          )}
                        </DropdownMenu.Item>
                      </div>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              <input
                type='text'
                value={slug}
                onChange={handleOnChange}
                onKeyUp={event => event.key === 'Enter' && !profileIsCreating && continueProfileCreate()}
                placeholder='your-slug-here'
                disabled={profileIsCreating}
                className={cn(
                  'w-full p-2 font-medium transition-[border] rounded-r-md outline-none disabled:pointer-events-none disabled:opacity-70 text-secondary placeholder-placeholder bg-secondary hover:bg-quaternary focus-visible:bg-quaternary',
                  slugIsAvailable === null ? 'border-2 border-transparent' : (
                    slugIsAvailable === true ? 'border-2 border-green-700' : 'border-2 border-red-700'
                  )
                )}
              />
            </div>


            <span className='w-full text-sm text-tertiary'>
              * You can change this later.
            </span>
          </div>
        
          <button className='flex justify-center items-center gap-x-1.5 w-full py-1.5 text-center bg-tertiary font-medium rounded-md text-secondary hover:text-primary hover:bg-quaternary disabled:pointer-events-none disabled:opacity-70 mt-4' disabled={!slugIsAvailable || profileIsCreating} onClick={continueProfileCreate}>
            {profileIsCreating ? (
              <>
                <TbLoader className='animate-spin' />
                Creating your profile..
              </>
            ) : 'Continue'}
          </button>
        </div>
      </div>
    </AuthProtected>
  );
}