'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import ErrorState from '@/app/components/ErrorState';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { HiPlus } from 'react-icons/hi';
import { t } from '@/stores/language';

export default function UploadSoundToDiscordModal({ guilds }) {
  const selectedGuildId = useGeneralStore(state => state.uploadSoundToDiscordModal.selectedGuildId);
  const setSelectedGuildId = useGeneralStore(state => state.uploadSoundToDiscordModal.setSelectedGuildId);

  return (
    <div className="flex items-center justify-center w-full h-full">
      {guilds.length === 0 ? (
        <div className="flex flex-col mt-4 gap-y-2">
          <ErrorState 
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('soundCard.uploadSoundToDiscordModal.emptyErrorState.title')}
              </div>
            }
            message={t('soundCard.uploadSoundToDiscordModal.emptyErrorState.message')}
          />

          <div className='w-full bg-quaternary my-4 h-[1px]' />
          
          <p className='text-xs text-tertiary'>
            {t('soundCard.uploadSoundToDiscordModal.emptyErrorState.notes', { br: <br /> })}
          </p>
        </div>
      ) : (
        <div className='flex flex-wrap items-center justify-center w-full gap-4'>
          {guilds
            .sort((a, b) => b.bot_in_guild - a.bot_in_guild)
            .map(guild => (
              <Tooltip
                content={guild.bot_in_guild ? guild.name : t('soundCard.uploadSoundToDiscordModal.tooltip.inviteOurBot', { guildName: guild.name })}
                key={guild.id}
                sideOffset={15}
              >
                {guild.bot_in_guild ? (
                  <div
                    className={cn(
                      'relative',
                      selectedGuildId === guild.id && 'pointer-events-none'
                    )}
                    onClick={() => setSelectedGuildId(guild.id)}
                  >
                    <ServerIcon
                      icon_url={guild.icon_url}
                      name={guild.name}
                      width={48}
                      height={48}
                      className={cn(
                        '[&_>h2]:text-lg rounded-full bg-quaternary hover:bg-secondary cursor-pointer hover:ring-2 transition-all ring-purple-500 ring-offset-4 ring-offset-[rgba(var(--bg-tertiary))]',
                        selectedGuildId === guild.id && 'ring-2 ring-purple-600'
                      )}
                    />
                  </div>
                ) : (
                  <Link
                    className='relative'
                    href={config.botInviteURL}
                  >
                    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-full bg-white/60 dark:bg-black/60'>
                      <HiPlus className='text-black dark:text-white' size={20} />
                    </div>
                    
                    <ServerIcon
                      icon_url={guild.icon_url}
                      name={guild.name}
                      width={48}
                      height={48}
                      className={cn(
                        '[&_>h2]:text-lg rounded-full bg-quaternary hover:bg-secondary cursor-pointer hover:ring-2 transition-all ring-purple-500 ring-offset-4 ring-offset-[rgba(var(--bg-tertiary))]',
                        selectedGuildId === guild.id && 'ring-2 ring-purple-600'
                      )}
                    />
                  </Link>
                )}
              </Tooltip>
            ))}
        </div>
      )}
    </div>
  );
}