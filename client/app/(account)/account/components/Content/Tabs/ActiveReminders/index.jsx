'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import Countdown from '@/app/components/Countdown';
import ErrorState from '@/app/components/ErrorState';
import cn from '@/lib/cn';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import useLanguageStore, { t } from '@/stores/language';

export default function ActiveReminders() {
  const data = useAccountStore(state => state.data);
  const language = useLanguageStore(state => state.language);

  const remindersCount = data.reminders?.length || 0;
  const voteRemindersCount = data.voteReminders?.length || 0;

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

              <div className='flex flex-col divide-y rounded-xl border-2 border-primary'>
                {data.reminders.map((reminder, index) => (
                  <div
                    key={reminder._id}
                    className={cn(
                      'flex items-center flex-wrap p-3 gap-4 justify-center sm:justify-between bg-secondary border-y-primary',
                      index === data.reminders.length - 1 ? 'rounded-b-xl' : '',
                      index === 0 ? 'rounded-t-xl' : ''
                    )}
                  >
                    <div className='flex w-full flex-wrap items-center gap-4 sm:items-start'>
                      <div className='flex flex-col items-start'>
                        <div className='hidden text-base font-semibold text-primary sm:block'>
                          {t('accountPage.tabs.activeReminders.fields.reminders.about')}
                        </div>

                        <div className='line-clamp-6 max-w-[300px] break-words text-xs font-medium text-tertiary'>
                          {reminder.about}
                        </div>
                      </div>

                      <div className='flex w-full flex-1 flex-col items-center sm:items-end'>
                        <div className='text-center text-base font-semibold text-primary'>
                          <Countdown
                            date={new Date(reminder.expire_at).getTime()}
                            renderer={({ days, hours, minutes, seconds, completed }) => {
                              if (completed) return t('accountPage.tabs.activeReminders.countdown.expired');

                              return t('accountPage.tabs.activeReminders.countdown.expiresIn', { days, hours, minutes, seconds });
                            }}
                          />
                        </div>

                        <div className='text-xs font-medium text-tertiary'>
                          {new Date(reminder.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                        </div>
                      </div>
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