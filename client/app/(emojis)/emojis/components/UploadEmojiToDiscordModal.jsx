'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import ErrorState from '@/app/components/ErrorState';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { HiPlus } from 'react-icons/hi';
import { t } from '@/stores/language';

export default function UploadEmojiToDiscordModal({ guilds }) {
  const selectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.selectedGuildId);
  const setSelectedGuildId = useGeneralStore(state => state.uploadEmojiToDiscordModal.setSelectedGuildId);

  return (
    <div className="flex size-full items-center justify-center">
      {guilds.length === 0 ? (
        <div className="mt-4 flex flex-col gap-y-2">
          <ErrorState
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.emptyErrorState.title')}
              </div>
            }
            message={t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.emptyErrorState.message')}
          />

          <div className='my-4 h-px w-full bg-quaternary' />

          <p className='text-xs text-tertiary'>
            {t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.notes', { br: <br /> })}
          </p>
        </div>
      ) : (
        <div className='flex w-full flex-wrap items-center justify-center gap-4'>
          {guilds
            .sort((a, b) => b.bot_in_guild - a.bot_in_guild)
            .map(guild => (
              <Tooltip
                content={guild.bot_in_guild ? guild.name : t('createEmojiPage.emojisPreview.uploadEmojiToDiscordModal.tooltip.inviteOurBot', { guildName: guild.name })}
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
                      id={guild.id}
                      hash={guild.icon}
                      size={64}
                      width={48}
                      height={48}
                      className={cn(
                        'rounded-full bg-quaternary hover:bg-secondary cursor-pointer hover:ring-2 transition-all ring-purple-500 ring-offset-4 ring-offset-[rgba(var(--bg-tertiary))]',
                        selectedGuildId === guild.id && 'ring-2 ring-purple-600'
                      )}
                    />
                  </div>
                ) : (
                  <Link
                    className='relative'
                    href={config.botInviteURL}
                  >
                    <div className='absolute left-0 top-0 flex size-full items-center justify-center rounded-full bg-white/60 dark:bg-black/60'>
                      <HiPlus className='text-black dark:text-white' size={20} />
                    </div>

                    <ServerIcon
                      id={guild.id}
                      hash={guild.icon}
                      size={64}
                      width={48}
                      height={48}
                      className={cn(
                        'rounded-full bg-quaternary hover:bg-secondary cursor-pointer hover:ring-2 transition-all ring-purple-500 ring-offset-4 ring-offset-[rgba(var(--bg-tertiary))]',
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