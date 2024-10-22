'use client';

import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import ErrorState from '@/app/components/ErrorState';
import config from '@/config';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { VList } from 'virtua';

export default function MyEmojis() {
  const data = useAccountStore(state => state.data);

  const concatenatedEmojis = data.emojis?.concat(data.emojiPacks).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.myEmojis.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myEmojis.subtitle')}
        </p>
      </div>

      <div className='mt-8 flex flex-col gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myEmojis.sections.listedEmojis.title')}

          <span className='ml-2 text-xs font-medium text-tertiary'>
            {concatenatedEmojis?.length || 0}
          </span>
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myEmojis.sections.listedEmojis.subtitle')}
        </p>

        {(concatenatedEmojis || []).length === 0 ? (
          <div className='mt-20 max-w-[800px]'>
            <ErrorState
              message={t('accountPage.tabs.myEmojis.sections.listedEmojis.emptyErrorState.message')}
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  {t('accountPage.tabs.myEmojis.sections.listedEmojis.emptyErrorState.title')}
                </div>
              }
            />
          </div>
        ) : (
          <VList
            className='mt-2 grid !h-[500px] max-w-[800px] grid-cols-1 gap-4 mobile:grid-cols-2 2xl:grid-cols-3 [&>div>div>div]:my-4 [&>div>div>div]:max-w-[98%]'
          >
            {concatenatedEmojis.map(emoji => (
              emoji.emoji_ids ? (
                <EmojiPackageCard
                  categories={emoji.categories}
                  className='[&>div]:bg-quaternary'
                  downloads={emoji.downloads}
                  emoji_ids={emoji.emoji_ids}
                  id={emoji.id}
                  key={emoji.id}
                  name={emoji.name}
                />
              ) : (
                <EmojiCard
                  animated={emoji.animated}
                  categories={emoji.categories}
                  className='[&>div]:bg-quaternary'
                  downloads={emoji.downloads}
                  id={emoji.id}
                  key={emoji.id}
                  name={emoji.name}
                />
              )
            ))}
          </VList>
        )}
      </div>

      <div className='mt-8 flex flex-col gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myEmojis.sections.newEmoji.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myEmojis.sections.newEmoji.subtitle')}
        </p>

        <div className='relative mt-2 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
            <BsQuestionCircleFill /> {t('accountPage.tabs.myEmojis.sections.newEmoji.note.title')}
          </h2>

          <p className='text-sm font-medium text-tertiary'>
            {t('accountPage.tabs.myEmojis.sections.newEmoji.note.description', {
              link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myEmojis.sections.newEmoji.note.linkText')}</Link>
            })}
          </p>
        </div>

        <div className='mt-4 flex flex-col gap-y-4 text-sm text-tertiary'>
          <Link
            className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            href='/emojis/create'
          >
            {t('buttons.letsGo')}
            <LuPlus />
          </Link>
        </div>
      </div>
    </>
  );
}