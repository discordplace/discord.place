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
      <NewBot />
    ) : (
      <>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            {t('accountPage.tabs.myBots.title')}
          </h1>

          <p className='text-sm text-secondary'>
            {t('accountPage.tabs.myBots.subtitle')}
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
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
            <div className='mt-20 max-w-[800px]'>
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
            <div className='mt-2 flex max-w-[800px] flex-wrap gap-4'>
              {data.bots.map(bot => (
                <Link
                  key={bot.id}
                  className='flex items-center gap-4 rounded-xl bg-secondary p-4 transition-opacity hover:opacity-70'
                  href={`/bots/${bot.id}`}
                >
                  <div className='relative size-12'>
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

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myBots.sections.newBot.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myBots.sections.newBot.subtitle')}
          </p>

          <div className='relative mt-2 flex w-full max-w-[800px] flex-col gap-y-2 rounded-xl border border-blue-500 bg-blue-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center gap-x-2 text-lg font-semibold'>
              <BsQuestionCircleFill /> {t('accountPage.tabs.myBots.sections.newBot.note.title')}
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              {t('accountPage.tabs.myBots.sections.newBot.note.description', {
                link: <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>{t('accountPage.tabs.myBots.sections.newBot.note.linkText')}</Link>
              })}
            </p>
          </div>

          <div className='mt-4 flex flex-col gap-y-4 text-sm text-tertiary'>
            <button
              className='flex w-max items-center gap-x-1 rounded-xl bg-black px-4 py-1.5 font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70'
              onClick={() => setCurrentlyAddingBot(true)}
            >
              {t('buttons.letsGo')}
              <LuPlus />
            </button>
          </div>
        </div>

        <div className='mt-8 flex flex-col gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            {t('accountPage.tabs.myBots.sections.pastDenials.title')}
          </h2>

          <p className='text-sm text-tertiary'>
            {t('accountPage.tabs.myBots.sections.pastDenials.subtitle')}
          </p>

          <div
            className={cn(
              'flex flex-col items-center w-full max-w-[800px] gap-y-4',
              (data.denies || []).length === 0 && 'my-20'
            )}
          >
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
                  className='relative mt-4 flex w-full max-w-[1000px] flex-col gap-y-2 rounded-xl border border-red-500 bg-red-500/10 p-4 transition-[margin,opacity] duration-1000 ease-in-out'
                  key={deny.bot.id}
                >
                  <h2 className='flex flex-wrap items-center gap-x-2 text-lg font-semibold'>
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

                  <div className='flex flex-wrap gap-x-1 text-sm font-medium text-tertiary'>
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
      </>
    )
  );
}