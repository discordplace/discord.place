'use client';

import { FaDisplay } from 'react-icons/fa6';
import Input from '@/app/(servers)/servers/[id]/manage/components/Input';

export default function EssentialInformation({ description, setDescription, inviteURL, setInviteURL }) {
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaDisplay size={24} className='text-purple-500' />
        Essential Information
      </h3>

      <p className='text-sm sm:text-base text-tertiary'>
        These are the most important settings for server. Be sure to fill them out correctly.
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
        <Input
          label='Description'
          description='This is the description that will be shown to everyone who visits your server on discord.place.'
          placeholder='A server that has a lot of cool things.'
          type='paragraph'
          onChange={event => setDescription(event.target.value)}
          value={description}
          className='h-[150px]'
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