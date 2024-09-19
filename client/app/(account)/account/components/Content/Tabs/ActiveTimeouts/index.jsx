'use client';

import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import Countdown from '@/app/components/Countdown';
import ErrorState from '@/app/components/ErrorState';
import cn from '@/lib/cn';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry } from 'react-icons/bs';
import useLanguageStore, { t } from '@/stores/language';

export default function ActiveTimeouts() {
  const data = useAccountStore(state => state.data);
  const language = useLanguageStore(state => state.language);
  
  const timeoutedBotsCount = data?.timeouts?.bots?.length || 0;
  const timeoutedServersCount = data?.timeouts?.servers?.length || 0;

  return (
    <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6 lg:mb-4'>
      <div className='flex flex-col gap-y-2'>
        <h1 className='text-xl font-bold text-primary'>
          {t('accountPage.tabs.activeTimeouts.title')}
        </h1>

        <p className='text-sm text-secondary'>
          {t('accountPage.tabs.activeTimeouts.subtitle')}
        </p>
      </div>

      {(timeoutedBotsCount === 0 && timeoutedServersCount === 0) ? (
        <div className='max-w-[800px] mt-20'>
          <ErrorState 
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('accountPage.tabs.activeTimeouts.emptyErrorState.title')}
              </div>
            }
            message={t('accountPage.tabs.activeTimeouts.emptyErrorState.message')}
          />
        </div>
      ) : (
        <>
          {timeoutedServersCount > 0 && (
            <div className='flex flex-col gap-y-4 max-w-[800px]'>
              <h2 className='text-sm font-bold text-secondary'>
                {t('accountPage.tabs.activeTimeouts.fields.servers.title')}

                <span className='ml-2 text-xs font-medium text-tertiary'>
                  {timeoutedServersCount}
                </span>
              </h2>

              <div className='flex flex-col border-2 divide-y border-primary rounded-xl'>
                {data.timeouts.servers.map((timeout, index) => (
                  <div
                    key={timeout.id}
                    className={cn(
                      'flex items-center flex-wrap p-3 gap-4 justify-center sm:justify-between bg-secondary border-y-primary',
                      index === data.timeouts.servers.length - 1 ? 'rounded-b-xl' : '',
                      index === 0 ? 'rounded-t-xl' : ''
                    )}
                  >
                    <Link
                      className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                      href={`/servers/${timeout.id}`}
                    >
                      <ServerIcon
                        id={timeout.id}
                        hash={timeout.icon}
                        size={32}
                        width={32}
                        height={32}
                        className='rounded-lg bg-quaternary'
                      />
                  
                      <div className='flex flex-col'>
                        <p className='text-sm font-bold text-secondary'>
                          {timeout.name}
                        </p>

                        <p className='text-xs text-tertiary'>
                          {timeout.id}
                        </p>
                      </div>
                    </Link>

                    <div className='flex flex-col items-center sm:items-end'>
                      <div className='text-base font-semibold text-center text-primary'>
                        <Countdown
                          date={new Date(timeout.createdAt).getTime() + 86400000}
                          renderer={({ hours, minutes, seconds, completed }) => {
                            if (completed) return t('accountPage.tabs.activeTimeouts.countdown.expired');
                            
                            return t('accountPage.tabs.activeTimeouts.countdown.remaining', { hours, minutes, seconds });
                          }}
                        />
                      </div>

                      <div className='text-xs font-medium text-tertiary'>
                        {new Date(timeout.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeoutedBotsCount > 0 && (
            <div className='flex flex-col gap-y-4 max-w-[800px]'>
              <h2 className='text-sm font-bold text-secondary'>
                {t('accountPage.tabs.activeTimeouts.fields.bots.title')}

                <span className='ml-2 text-xs font-medium text-tertiary'>
                  {timeoutedBotsCount}
                </span>
              </h2>

              <div className='flex flex-col border-2 divide-y border-primary rounded-xl'>
                {data.timeouts.bots.map((timeout, index) => (
                  <div
                    key={timeout.id}
                    className={cn(
                      'flex items-center flex-wrap justify-center p-3 gap-4 sm:justify-between bg-secondary border-y-primary',
                      index === data.timeouts.bots.length - 1 ? 'rounded-b-xl' : '',
                      index === 0 ? 'rounded-t-xl' : ''
                    )}
                  >
                    <Link
                      className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                      href={`/bots/${timeout.id}`}
                    >
                      {timeout.username ? (
                        <>
                          <UserAvatar
                            id={timeout.id}
                            hash={timeout.avatar}
                            size={32}
                            width={32}
                            height={32}
                            className='rounded-lg'
                          />

                          <div className='flex flex-col'>
                            <p className='text-sm font-bold text-secondary'>
                              {timeout.username}
                            </p>

                            <p className='text-xs text-tertiary'>
                              {timeout.id}
                            </p>
                          </div>
                        </>
                      ) : (
                        timeout.id
                      )}
                    </Link>

                    <div className='flex flex-col items-center sm:items-end'>
                      <div className='text-base font-semibold text-center text-primary'>
                        <Countdown
                          date={new Date(timeout.createdAt).getTime() + 86400000}
                          renderer={({ hours, minutes, seconds, completed }) => {
                            if (completed) return t('accountPage.tabs.activeTimeouts.countdown.expired');

                            return t('accountPage.tabs.activeTimeouts.countdown.remaining', { hours, minutes, seconds });
                          }}
                        />
                      </div>

                      <div className='text-xs font-medium text-tertiary'>
                        {new Date(timeout.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}