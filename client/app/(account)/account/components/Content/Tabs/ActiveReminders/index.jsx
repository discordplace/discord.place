'use client';

import { IoChevronDown, IoPaperPlane, BsEmojiAngry } from '@/icons';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import Countdown from '@/app/components/Countdown';
import ErrorState from '@/app/components/ErrorState';
import cn from '@/lib/cn';
import useAccountStore from '@/stores/account';
import Link from 'next/link';import useLanguageStore, { t } from '@/stores/language';import AnimateHeight from 'react-animate-height';
import { useState } from 'react';

export default function ActiveReminders() {
  const data = useAccountStore(state => state.data);
  const language = useLanguageStore(state => state.language);

  const remindersCount = data.reminders?.length || 0;
  const voteRemindersCount = data.voteReminders?.length || 0;

  const [activeReminder, setActiveReminder] = useState(null);

  return (
    <>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.activeReminders.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.activeReminders.subtitle')}
        </p>
      </div>

      {(remindersCount === 0 && voteRemindersCount === 0) ? (
        <div className='mt-20 max-w-[800px]'>
          <ErrorState
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('accountPage.tabs.activeReminders.emptyErrorState.title')}
              </div>
            }
            message={t('accountPage.tabs.activeReminders.emptyErrorState.message')}
          />
        </div>
      ) : (
        <>
          {remindersCount > 0 && (
            <div className='flex max-w-[800px] flex-col gap-y-4'>
              <h2 className='text-sm font-bold text-secondary'>
                {t('accountPage.tabs.activeReminders.fields.reminders.title')}

                <span className='ml-2 text-xs font-medium text-tertiary'>
                  {remindersCount}
                </span>
              </h2>

              <div className='flex flex-col gap-y-1'>
                {data.reminders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(reminder => (
                    <div
                      className='flex w-full cursor-pointer select-none items-start justify-between rounded-xl border border-primary bg-secondary p-3 hover:bg-tertiary'
                      key={reminder._id}
                      onClick={() => setActiveReminder(activeReminder === reminder._id ? null : reminder._id)}
                    >
                      <div className='flex flex-col'>
                        <div
                          className={cn(
                            'flex transition-all mt-[0.4rem] duration-300 items-center gap-x-2 text-sm font-semibold text-primary',
                            activeReminder === reminder._id && 'mt-0'
                          )}
                        >
                          <IoPaperPlane />

                          <span className='max-w-[200px] truncate mobile:max-w-[unset]'>
                            {t('accountPage.tabs.activeReminders.fields.reminders.itemTitle', { id: reminder._id })}
                          </span>

                          <span className='text-xs font-medium text-tertiary'>
                            <IoChevronDown
                              className={cn(
                                'transition-transform',
                                activeReminder === reminder._id && 'transform rotate-180'
                              )}
                            />
                          </span>
                        </div>

                        <AnimateHeight
                          duration={300}
                          height={activeReminder === reminder._id ? 'auto' : 0}
                          animateOpacity={true}
                        >
                          <div className='mt-2 flex flex-col gap-y-2'>
                            <div className='text-sm font-semibold text-primary'>
                              {t('accountPage.tabs.activeReminders.fields.reminders.about')}
                            </div>

                            <div className='max-w-[60w] break-words text-xs font-medium text-tertiary xl:max-w-[450px]'>
                              {reminder.about}
                            </div>

                            <div className='mt-1 flex flex-col items-start text-xs font-medium xl:hidden'>
                              <span className='text-primary'>
                                <Countdown
                                  date={new Date(reminder.expire_at).getTime()}
                                  renderer={({ days, hours, minutes, seconds, completed }) => {
                                    if (completed) return t('accountPage.tabs.activeReminders.countdown.expired');

                                    return t('accountPage.tabs.activeReminders.countdown.expiresIn', { days, hours, minutes, seconds });
                                  }}
                                />
                              </span>

                              <span className='text-tertiary'>
                                {new Date(reminder.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </AnimateHeight>
                      </div>

                      <div className='hidden flex-col items-end text-xs font-medium xl:flex'>
                        <span className='text-primary'>
                          <Countdown
                            date={new Date(reminder.expire_at).getTime()}
                            renderer={({ days, hours, minutes, seconds, completed }) => {
                              if (completed) return t('accountPage.tabs.activeReminders.countdown.expired');

                              return t('accountPage.tabs.activeReminders.countdown.expiresIn', { days, hours, minutes, seconds });
                            }}
                          />
                        </span>

                        <span className='text-tertiary'>
                          {new Date(reminder.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {voteRemindersCount > 0 && (
            <div className='flex max-w-[800px] flex-col gap-y-4'>
              <h2 className='text-sm font-bold text-secondary'>
                {t('accountPage.tabs.activeReminders.fields.voteReminders.title')}

                <span className='ml-2 text-xs font-medium text-tertiary'>
                  {voteRemindersCount}
                </span>
              </h2>

              <div className='flex flex-col divide-y rounded-xl border-2 border-primary'>

                {data.voteReminders.map((voteReminder, index) => (
                  <div
                    key={voteReminder._id}
                    className={cn(
                      'flex items-center p-3 gap-4 justify-center flex-wrap sm:justify-between bg-secondary border-y-primary',
                      index === data.voteReminders.length - 1 ? 'rounded-b-xl' : '',
                      index === 0 ? 'rounded-t-xl' : ''
                    )}
                  >
                    <Link
                      className='flex items-center gap-x-4 transition-opacity hover:opacity-70'
                      href={`/servers/${voteReminder.guild.id}`}
                    >
                      <ServerIcon
                        id={voteReminder.guild.id}
                        hash={voteReminder.guild.icon}
                        size={32}
                        width={32}
                        height={32}
                        className='rounded-lg'
                      />

                      <div className='flex flex-col'>
                        <p className='text-sm font-bold text-secondary'>
                          {voteReminder.guild.name}
                        </p>

                        <p className='text-xs text-tertiary'>
                          {voteReminder.guild.id}
                        </p>
                      </div>
                    </Link>

                    <div className='flex flex-col items-center sm:items-end'>
                      <div className='text-center text-base font-semibold text-primary'>
                        <Countdown
                          date={new Date(voteReminder.createdAt).getTime() + 86400000}
                          renderer={({ hours, minutes, seconds, completed }) => {
                            if (completed) return t('accountPage.tabs.activeReminders.countdown.expired');

                            return t('accountPage.tabs.activeReminders.countdown.expiresInShort', { hours, minutes, seconds });
                          }}
                        />
                      </div>

                      <div className='text-xs font-medium text-tertiary'>
                        {new Date(voteReminder.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}