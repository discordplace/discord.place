'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import ErrorState from '@/app/components/ErrorState';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';

export default function UploadEmojiToDiscordModal({ guilds }) {
  const selectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedGuildId);
  const setSelectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.setSelectedGuildId);

  return (
    <div className="flex items-center justify-center w-full h-full">
      {guilds.length === 0 ? (
        <div className="flex flex-col mt-4 gap-y-2">
          <ErrorState 
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                It{'\''}s quiet in here...
              </div>
            }
            message={'There are no servers where you can upload emojis to.'}
          />

          <div className='w-full bg-quaternary my-4 h-[1px]' />
          
          <p className='text-xs text-tertiary'>
            * You should have the permission to manage emojis in the server.<br />
            * <Link
              className='text-secondary hover:text-primary'
              href={config.botInviteURL}
              target='_blank'>
                Our bot
            </Link>
            {' '}must be in the server you want to upload emojis to.
          </p>
        </div>
      ) : (
        <div className='flex items-center justify-center w-full gap-4'>
          {guilds.map(guild => (
            <Tooltip
              content={guild.name}
              key={guild.id}
              sideOffset={15}
            >
              <div
                className={cn(
                  'relative',
                  selectedGuildId === guild.id && 'pointer-events-none'
                )}
                onClick={() => setSelectedGuildId(guild.id)}
              >
                <ServerIcon
                  src={guild.icon_url}
                  name={guild.name}
                  width={48}
                  height={48}
                  className={cn(
                    '[&_>h2]:text-lg rounded-full bg-quaternary hover:bg-secondary cursor-pointer hover:ring-2 transition-all ring-purple-500 ring-offset-4 ring-offset-[rgba(var(--bg-tertiary))]',
                    selectedGuildId === guild.id && 'ring-2 ring-purple-600'
                  )}
                />
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}