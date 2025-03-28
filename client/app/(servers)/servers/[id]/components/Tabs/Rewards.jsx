'use client';

import { TbSquareRoundedChevronUp, IoMdLock, IoMdUnlock } from '@/icons';
import cn from '@/lib/cn';
import Image from 'next/image';import useAuthStore from '@/stores/auth';
import Tooltip from '@/app/components/Tooltip';
import { t } from '@/stores/language';

export default function Rewards({ server }) {
  const loggedIn = useAuthStore(state => state.loggedIn);

  return (
    <div className='w-full px-8 lg:max-w-[70%] lg:px-0'>
      <h2 className='text-xl font-semibold'>
        {t('serverPage.tabs.rewards.title')}
      </h2>

      <p className='mt-2 text-sm text-tertiary'>
        {t('serverPage.tabs.rewards.subtitle', { serverName: server.name })}
      </p>

      <div className='mt-6 grid w-full grid-cols-1' key='rewards'>
        {server.rewards.sort((a, b) => b.required_votes - a.required_votes).map((reward, index) => (
          <div
            key={reward.id}
            className={cn(
              'flex items-center w-full gap-4 p-4 odd:bg-secondary even:bg-tertiary',
              index === 0 && 'rounded-t-xl',
              index === server.rewards.length - 1 && 'rounded-b-xl'
            )}
          >
            {reward.role.icon_url ? (
              <Image
                src={reward.role.icon_url}
                alt={`${reward.role.name}'s icon`}
                width={40}
                height={40}
                className='rounded-full'
              />
            ) : (
              <svg
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                width='40'
                height='40'
                fill='none'
                viewBox='0 0 24 24'
                className='text-tertiary'
              >
                <path
                  fill='currentColor'
                  fillRule='evenodd'
                  d='M3.47 5.18c.27-.4.64-.74 1.1-.96l6.09-3.05a3 3 0 0 1 2.68 0l6.1 3.05A2.83 2.83 0 0 1 21 6.75v3.5a14.17 14.17 0 0 1-8.42 12.5c-.37.16-.79.16-1.16 0A14.18 14.18 0 0 1 3 9.77V6.75c0-.57.17-1.11.47-1.57Zm2.95 10.3A12.18 12.18 0 0 0 12 20.82a12.18 12.18 0 0 0 5.58-5.32A9.49 9.49 0 0 0 12.47 14h-.94c-1.88 0-3.63.55-5.11 1.49ZM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
                  clipRule='evenodd'
                />
              </svg>
            )}

            <h2 className='flex items-center gap-x-2 text-base font-semibold sm:text-lg'>
              <span className='max-w-[100px] truncate mobile:max-w-[150px] sm:max-w-[250px] md:max-w-[400px]'>
                {reward.role.name}
              </span>

              {loggedIn && (
                <Tooltip content={reward.unlocked ? t('serverPage.tabs.rewards.tooltip.unlocked') : t('serverPage.tabs.rewards.tooltip.locked')}>
                  <span
                    className={cn(
                      'flex items-center text-xs font-medium gap-x-1 text-tertiary select-none',
                      reward.unlocked ? 'text-green-500' : 'text-yellow-500'
                    )}
                  >
                    {reward.unlocked ? (
                      <>
                        <span className='hidden mobile:block'>
                          {t('serverPage.tabs.rewards.badge.unlocked')}
                        </span>

                        <IoMdUnlock />
                      </>
                    ) : (
                      <>
                        <span className='hidden mobile:block'>
                          {t('serverPage.tabs.rewards.badge.locked')}
                        </span>

                        <IoMdLock />
                      </>
                    )}
                  </span>
                </Tooltip>
              )}
            </h2>

            <div className='ml-auto flex items-center gap-x-2 text-base font-bold sm:text-xl'>
              {reward.required_votes}

              <TbSquareRoundedChevronUp />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}