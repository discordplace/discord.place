'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import TemplateCard from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import { t } from '@/stores/language';

export default function MyTemplates() {
  const data = useAccountStore(state => state.data);

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.myTemplates.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.myTemplates.subtitle')}
        </p>
      </div>

      <div className='mt-8 flex flex-col gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myTemplates.sections.listedTemplates.title')}

          <span className='ml-2 text-xs font-medium text-tertiary'>
            {data.templates?.length || 0}
          </span>
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myTemplates.sections.listedTemplates.subtitle')}
        </p>

        {(data.templates || []).length === 0 ? (
          <div className='mt-20 max-w-[800px]'>
            <ErrorState
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  {t('accountPage.tabs.myTemplates.sections.listedTemplates.emptyErrorState.title')}
                </div>
              }
              message={t('accountPage.tabs.myTemplates.sections.listedTemplates.emptyErrorState.message')}
            />
          </div>
        ) : (
          <div className='mt-2 grid max-w-[800px] grid-cols-1 gap-4 xl:grid-cols-2'>
            {data.templates.map(emoji => (
              <TemplateCard
                key={emoji.id}
                data={emoji}
                className='[&>div>a>div:first-child]:size-[75px] [&>div>a>div:first-child]:min-h-[75px] [&>div>a>div:first-child]:min-w-[75px] [&>div>a>div:first-child]:text-lg sm:[&>div>a>div:first-child]:size-[100px] sm:[&>div>a>div:first-child]:min-h-[100px] sm:[&>div>a>div:first-child]:min-w-[100px] sm:[&>div>a>div:first-child]:text-3xl [&>div>a]:items-start sm:[&>div>a]:items-center'
              />
            ))}
          </div>
        )}
      </div>

      <div className='mt-8 flex flex-col gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myTemplates.sections.newTemplate.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myTemplates.sections.newTemplate.subtitle')}
        </p>

        <div className='relative mt-2 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
            <BsQuestionCircleFill /> {t('accountPage.tabs.myTemplates.sections.newTemplate.note.title')}
          </h2>

          <p className='text-sm font-medium text-tertiary'>
            {t('accountPage.tabs.myTemplates.sections.newTemplate.note.description', {
              link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myTemplates.sections.newTemplate.note.linkText')}</Link>
            })}
          </p>
        </div>

        <div className='mt-4 flex flex-col gap-y-4 text-sm text-tertiary'>
          <Link
            className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
            href='/templates/create'
          >
            {t('buttons.letsGo')}
            <LuPlus />
          </Link>
        </div>
      </div>
    </>
  );
}