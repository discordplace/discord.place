'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import { VList } from 'virtua';
import { t } from '@/stores/language';

export default function MyEmojis() {
  const data = useAccountStore(state => state.data);

  const concatenatedEmojis = data.emojis?.concat(data.emojiPacks).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return (
    <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.myEmojis.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myEmojis.subtitle')}
        </p>
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myEmojis.sections.listedEmojis.title')}

          <span className='ml-2 text-xs font-medium text-tertiary'>
            {concatenatedEmojis?.length || 0}
          </span>
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myEmojis.sections.listedEmojis.description')}
        </p>

        {(concatenatedEmojis || []).length === 0 ? (
          <div className='max-w-[800px] mt-20'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  {t('accountPage.tabs.myEmojis.sections.listedEmojis.emptyErrorState.title')}
                </div>
              }
              message={t('accountPage.tabs.myEmojis.sections.listedEmojis.emptyErrorState.message')}
            />
          </div>
        ) : (
          <VList
            className='[&>div>div>div]:my-4 [&>div>div>div]:max-w-[98%] !h-[500px] gap-4 max-w-[800px] mt-2 grid grid-cols-1 mobile:grid-cols-2 2xl:grid-cols-3'
          >
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
          </VList>
        )}
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myEmojis.sections.newEmoji.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myEmojis.sections.newEmoji.subtitle')}
        </p>

        <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center text-lg font-semibold gap-x-2'>
            <BsQuestionCircleFill /> {t('accountPage.tabs.myEmojis.sections.newEmoji.note.title')}
          </h2>

          <p className='text-sm font-medium text-tertiary'>
            {t('accountPage.tabs.myEmojis.sections.newEmoji.note.description', {
              link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myEmojis.sections.newEmoji.note.linkText')}</Link>
            })}
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
          <Link
            className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
            href='/emojis/create'
          >
            {t('buttons.letsGo')}
            <LuPlus />
          </Link>
        </div>
      </div>
    </div>
  );
}