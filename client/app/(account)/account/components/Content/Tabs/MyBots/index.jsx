'use client';

import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry, BsQuestionCircleFill } from 'react-icons/bs';
import NewBot from '@/app/(account)/account/components/Content/Tabs/MyBots/NewBot';
import { LuPlus } from 'react-icons/lu';
import config from '@/config';
import Countdown from '@/app/components/Countdown';
import cn from '@/lib/cn';
import { FaCircleExclamation } from 'react-icons/fa6';
import { t } from '@/stores/language';

export default function MyBots() {
  const data = useAccountStore(state => state.data);
  
  const currentlyAddingBot = useAccountStore(state => state.currentlyAddingBot);
  const setCurrentlyAddingBot = useAccountStore(state => state.setCurrentlyAddingBot);

  return (
    currentlyAddingBot ? (
      <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6 lg:mb-4'>
        <NewBot />
      </div>
    ) : (
      <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6 lg:mb-4'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.myBots.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.myBots.subtitle')}
          </p>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myBots.sections.listedBots.title')}

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.bots?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myBots.sections.listedBots.subtitle')}
          </p>

          {(data.bots || []).length === 0 ? (
            <div className='max-w-[800px] mt-20'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myBots.sections.listedBots.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.myBots.sections.listedBots.emptyErrorState.message')}
              />
            </div>
          ) : (
            <div className='flex gap-4 flex-wrap max-w-[800px] mt-2'>
              {data.bots.map(bot => (
                <Link
                  key={bot.id}
                  className='flex items-center gap-4 p-4 transition-opacity bg-secondary rounded-xl hover:opacity-70'
                  href={`/bots/${bot.id}`}
                >
                  <div className='relative w-12 h-12'>
                    <UserAvatar
                      id={bot.id}
                      hash={bot.avatar}
                      size={64}
                      width={48}
                      height={48}
                      className='rounded-lg'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <h3 className='text-sm font-bold text-primary'>
                      {bot.username}
                    </h3>

                    <p className='text-xs text-tertiary'>
                      {bot.id}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myBots.sections.newBot.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myBots.sections.newBot.subtitle')}
          </p>

          <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill /> {t('accountPage.tabs.myBots.sections.newBot.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.myBots.sections.newBot.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myBots.sections.newBot.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
            <button
              className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
              onClick={() => setCurrentlyAddingBot(true)}
            >
              {t('buttons.letsGo')}
              <LuPlus />
            </button>
          </div>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myBots.sections.pastDenials.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myBots.sections.pastDenials.subtitle')}
          </p>
        
          <div className={cn(
            'flex flex-col items-center w-full max-w-[800px] gap-y-4',
            (data.denies || []).length === 0 && 'mt-20'
          )}>
            {(data.denies || []).length === 0 ? (
              <ErrorState
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    {t('accountPage.tabs.myBots.sections.pastDenials.emptyErrorState.title')}
                  </div>
                }
                message={t('accountPage.tabs.myBots.sections.pastDenials.emptyErrorState.message')}
              />
            ) : (
              data.denies.map(deny => (
                <div 
                  className='relative flex flex-col gap-y-2 w-full max-w-[1000px] bg-red-500/10 border border-red-500 p-4 rounded-xl mt-4 transition-[margin,opacity] duration-1000 ease-in-out' 
                  key={deny.bot.id}
                >
                  <h2 className='flex flex-wrap items-center text-lg font-semibold gap-x-2'>
                    <FaCircleExclamation />
                    
                    <UserAvatar
                      id={deny.bot.id}
                      hash={deny.bot.avatar}
                      size={32}
                      width={24}
                      height={24}
                      className='rounded-full'
                    />

                    {deny.bot.username}#{deny.bot.discriminator}
                  </h2>
  
                  <div className='flex flex-wrap text-sm font-medium text-tertiary gap-x-1'>
                    {t('accountPage.tabs.myBots.sections.pastDenials.deniedBy', {
                      moderator: (
                        <span className='text-secondary'>
                          @{deny.reviewer.username}
                        </span>
                      )
                    })}
                  </div>

                  <div className='flex flex-col gap-y-1'>
                    <h3 className='text-lg font-semibold text-secondary'>
                      {deny.reason.title}
                    </h3>

                    <p className='text-sm text-tertiary'>
                      {deny.reason.description}
                    </p>
                  </div>

                  <div className='mt-2 text-xs text-tertiary'>
                    {new Date(deny.createdAt).getTime() + 21600000 > Date.now() ? (
                      <span>
                        {t('accountPage.tabs.myBots.sections.pastDenials.countdown.expiresIn', {
                          countdown: (
                            <Countdown 
                              date={new Date(deny.createdAt).getTime() + 21600000} 
                              renderer={({ hours, minutes, seconds, completed }) => {
                                if (completed) return t('accountPage.tabs.myBots.sections.pastDenials.countdown.completed');
                                return t('accountPage.tabs.myBots.sections.pastDenials.countdown.renderer', { hours, minutes, seconds });
                              }}
                            />
                          )
                        })}
                      </span>
                    ) : t('accountPage.tabs.myBots.sections.pastDenials.countdown.expired')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}