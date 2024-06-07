'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiPackageCard';

export default function MyEmojis() {
  const data = useAccountStore(state => state.data);

  const concatenatedEmojis = data.emojis?.concat(data.emojiPacks).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return (
    <div className='flex flex-col px-6 mt-16 lg:px-16 gap-y-6'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          My Emojis
        </h1>

        <p className='text-sm text-secondary'>
          View or manage the emojis that you have listed on discord.place. You can also submit a new emoji to discord.place.
        </p>
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          Listed Emojis

          <span className='ml-2 text-xs font-medium text-tertiary'>
            {concatenatedEmojis?.length || 0}
          </span>
        </h2>

        <p className='text-sm text-tertiary'>
          Here, you can see the emojis that you have listed on discord.place.
        </p>

        {(concatenatedEmojis || []).length === 0 ? (
          <div className='max-w-[800px] mt-20'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              }
              message={'You have not listed any bots on discord.place.'}
            />
          </div>
        ) : (
          <div className='gap-4 max-w-[800px] mt-2 grid grid-cols-1 mobile:grid-cols-2 2xl:grid-cols-3'>
            {concatenatedEmojis.map(emoji => (
              emoji.emoji_ids ? (
                <EmojiPackageCard
                  key={emoji.id}
                  id={emoji.id}
                  name={emoji.name}
                  categories={emoji.categories}
                  downloads={emoji.downloads}
                  emoji_ids={emoji.emoji_ids}
                  className='[&>div]:bg-quaternary'
                />
              ) : (
                <EmojiCard
                  key={emoji.id}
                  id={emoji.id}
                  name={emoji.name}
                  animated={emoji.animated}
                  categories={emoji.categories}
                  downloads={emoji.downloads}
                  className='[&>div]:bg-quaternary'
                />
              )
            ))}
          </div>
        )}
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          New Emoji
        </h2>

        <p className='text-sm text-tertiary'>
          Submit a new emoji to discord.place.
        </p>

        <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center text-lg font-semibold gap-x-2'>
            <BsQuestionCircleFill /> Note
          </h2>

          <p className='text-sm font-medium text-tertiary'>
            Your submitted emoji will be reviewed by our team before it is listed on discord.place. Please make sure that your emoji is not violating our emoji submission guidelines. Our emoji submission guidelines can be found in our <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>Discord server</Link>.
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
          <Link
            className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
            href='/emojis/create'
          >
            Let{'\''}s go!
            <LuPlus />
          </Link>
        </div>
      </div>
    </div>
  );
}