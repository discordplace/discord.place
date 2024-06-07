'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuPlus } from 'react-icons/lu';
import { BsQuestionCircleFill } from 'react-icons/bs';
import config from '@/config';
import TemplateCard from '@/app/(templates)/templates/components/Hero/SearchResults/Card';

export default function MyTemplates() {
  const data = useAccountStore(state => state.data);
  
  return (
    <div className='flex flex-col px-6 mt-16 lg:px-16 gap-y-6'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          My Templates
        </h1>

        <p className='text-sm text-secondary'>
          View templates that you have listed on discord.place. You can also submit a new template to discord.place.
        </p>
      </div>

      <div className='flex flex-col mt-8 gap-y-2'>
        <h2 className='text-sm font-bold text-secondary'>
          Listed Templates

          <span className='ml-2 text-xs font-medium text-tertiary'>
            {data.templates?.length || 0}
          </span>
        </h2>

        <p className='text-sm text-tertiary'>
          Here, you can see the emojis that you have listed on discord.place.
        </p>

        {(data.templates || []).length === 0 ? (
          <div className='max-w-[800px] mt-20'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              }
              message={'You have not listed any templates on discord.place.'}
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
          New Template
        </h2>

        <p className='text-sm text-tertiary'>
          Submit a new template to discord.place.
        </p>

        <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
          <h2 className='flex items-center text-lg font-semibold gap-x-2'>
            <BsQuestionCircleFill /> Note
          </h2>

          <p className='font-medium tetx-sm text-tertiary'>
            Your submitted template will be reviewed by our team before it is listed on discord.place. Please make sure that your template is not violating our template submission guidelines. Our template submission guidelines can be found in our <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>Discord server</Link>.
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
          <Link
            className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
            href='/templates/create'
          >
            Let{'\''}s go!
            <LuPlus />
          </Link>
        </div>
      </div>
    </div>
  );
}