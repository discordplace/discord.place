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

      <div className='flex flex-col mt-8 gap-y-2'>
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
          <div className='max-w-[800px] mt-20'>
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
          <div className='gap-4 max-w-[800px] mt-2 grid grid-cols-1 xl:grid-cols-2'>
            {data.templates.map(emoji => (
              <TemplateCard
                key={emoji.id}
                data={emoji}
                className='[&>div>a]:items-start sm:[&>div>a]:items-center [&>div>a>div:first-child]:min-w-[75px] sm:[&>div>a>div:first-child]:min-w-[100px] [&>div>a>div:first-child]:min-h-[75px] sm:[&>div>a>div:first-child]:min-h-[100px] [&>div>a>div:first-child]:w-[75px] sm:[&>div>a>div:first-child]:w-[100px] [&>div>a>div:first-child]:h-[75px] sm:[&>div>a>div:first-child]:h-[100px] [&>div>a>div:first-child]:text-lg sm:[&>div>a>div:first-child]:text-3xl'
              />
            ))}
          </div>
        )}
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          {t('accountPage.tabs.myTemplates.sections.newTemplate.title')}
        </h2>

        <p className='text-sm text-tertiary'>
          {t('accountPage.tabs.myTemplates.sections.newTemplate.subtitle')}
        </p>

        <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center text-lg font-semibold gap-x-2'>
            <BsQuestionCircleFill /> {t('accountPage.tabs.myTemplates.sections.newTemplate.note.title')}
          </h2>

          <p className='text-sm font-medium text-tertiary'>
            {t('accountPage.tabs.myTemplates.sections.newTemplate.note.description', {
              link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myTemplates.sections.newTemplate.note.linkText')}</Link>
            })}
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
          <Link
            className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
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