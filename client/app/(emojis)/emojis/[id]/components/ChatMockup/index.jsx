'use client';

import cn from '@/lib/cn';
import Image from 'next/image';
import useLanguageStore from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function ChatMockup({ id, username, avatar, message, emoji_url, theme, index }) {
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
        id={id}
        hash={avatar}
        size={128}
        width={128}
        height={128}
        className='size-[46px] rounded-full'
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
            {new Date().toLocaleDateString(language, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',','')}
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
            src={emoji_url}
            width={22}
            height={22}
            alt='Emoji'
          />
        </div>
      </div>
    </div>
  );
}
