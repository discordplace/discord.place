'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import cn from '@/lib/cn';
import useLanguageStore from '@/stores/language';
import Image from 'next/image';

export default function ChatMockup({ avatar, emoji_url, id, index, message, theme, username }) {
  const language = useLanguageStore(state => state.language);

  return (
    <div
      className={cn(
        'flex w-full h-20 gap-x-3 pl-4 pt-4 select-none',
        index === 0 ? 'rounded-t-xl' : 'rounded-b-xl',
        theme === 'dark' ? 'bg-[rgb(var(--dark-bg-secondary))]' : 'bg-[rgb(var(--light-bg-secondary))]'
      )}
    >
      <UserAvatar
        className='size-[46px] rounded-full'
        hash={avatar}
        height={128}
        id={id}
        size={128}
        width={128}
      />

      <div className='flex flex-col gap-y-1'>
        <div className='flex items-center gap-x-2 text-clip sm:overflow-visible'>
          <h1 className={cn(
            'text-base font-medium',
            theme === 'dark' ? 'text-[rgb(var(--dark-text-secondary))]' : 'text-[rgb(var(--light-text-secondary))]'
          )}>
            {username}
          </h1>

          <span
            className={cn(
              'text-xs font-medium truncate max-w-[40%] mobile:max-w-[unset]',
              theme === 'dark' ? 'text-[rgb(var(--dark-text-tertiary))]' : 'text-[rgb(var(--light-text-tertiary))]'
            )}
          >
            {new Date().toLocaleDateString(language, { day: '2-digit', hour: '2-digit', minute: '2-digit', month: 'short', year: 'numeric' }).replace(',','')}
          </span>
        </div>

        <div className='flex items-center gap-x-1'>
          <span
            className={cn(
              'text-sm truncate max-w-[100%] w-full hidden mobile:flex',
              theme === 'dark' ? 'text-[rgb(var(--dark-text-secondary))]' : 'text-[rgb(var(--light-text-secondary))]'
            )}
          >
            {message}
          </span>

          <Image
            alt='Emoji'
            height={22}
            src={emoji_url}
            width={22}
          />
        </div>
      </div>
    </div>
  );
}
