'use client';

import { FaDisplay } from 'react-icons/fa6';
import Markdown from '@/app/components/Markdown';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import Input from '@/app/(bots)/bots/[id]/manage/components/Input';

export default function EssentialInformation({ shortDescription, setShortDescription, description, setDescription, inviteURL, setInviteURL, markdownPreviewing, setMarkdownPreviewing }) {
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaDisplay size={24} className='text-purple-500' />
        Essential Information
      </h3>

      <p className='text-sm sm:text-base text-tertiary'>
        These are the most important settings for bot. Be sure to fill them out correctly.
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
        <Input
          label='Short Description'
          description='A short description of your bot. This will be shown in search results.'
          placeholder='A bot that does cool things.'
          onChange={event => setShortDescription(event.target.value)}
          value={shortDescription}
        />

        <Input
          label={
            <div className='flex items-center gap-x-2 w-max'>
              <span>Long Description</span>
            </div>
          }
          customLabelPeer={
            <button 
              className='flex items-center gap-x-1.5 py-0.5 px-2 rounded-lg font-semibold text-white bg-black w-max h-max hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70 text-sm disabled:pointer-events-none disabled:opacity-70' 
              onClick={() => setMarkdownPreviewing(!markdownPreviewing)}
            >
              {markdownPreviewing ? (
                <>
                  <RiEyeOffFill />
                  <span className='hidden sm:block'>Back to Editing</span>
                </>
              ) : (
                <>
                  <RiEyeFill />
                  <span className='hidden sm:block'>Show Markdown Preview</span>
                </>
              )}
            </button>
          }
          description='A longer description of your bot. This will be shown on your bot page. Markdown is supported.'
          placeholder='A bot that does cool things and more.'
          type='paragraph'
          onChange={event => setDescription(event.target.value)}
          value={description}
          CustomInput={markdownPreviewing && (
            <Markdown className='overflow-y-auto mt-2 w-full h-[250px] px-4 py-2 text-tertiary focus-visible:text-primary bg-secondary rounded-xl'>
              {description}
            </Markdown>
          )}
        />

        <Input
          label='Invite URL'
          description='The URL that users can use to invite your bot to their server.'
          placeholder='Paste your bot invite URL here.'
          onChange={event => setInviteURL(event.target.value)}
          value={inviteURL}
        />
      </div>
    </div>
  );
}