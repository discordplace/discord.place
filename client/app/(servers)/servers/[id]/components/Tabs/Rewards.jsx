import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import fetchRewards from '@/lib/request/servers/fetchRewards';
import cn from '@/lib/cn';
import Image from 'next/image';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { IoMdLock, IoMdUnlock } from 'react-icons/io';

export default function Rewards({ server }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchRewards(server.id)
      .then(data => setRewards(data))
      .catch(error => toast.error(error))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='lg:max-w-[70%] w-full px-8 lg:px-0'>
      <h2 className='text-xl font-semibold'>
        Rewards
      </h2>

      <p className='mt-2 text-sm text-tertiary'>
        Roles are given automatically to whoever reaches the required votes. Note that, these rewards is only for the server {server.name}.
      </p>

      {loading ? (
        <div className='grid w-full grid-cols-1 mt-4' key='loading'>
          {new Array(5).fill().map((_, index) => (
            <div key={index} className='flex items-center w-full gap-4 px-4 h-[72px] odd:bg-secondary even:bg-tertiary first:rounded-t-xl last:rounded-b-xl'>
              <div className='w-10 h-10 rounded-lg bg-quaternary animate-pulse' />
              <div className='w-1/3 h-4 rounded-lg bg-quaternary animate-pulse' />
              <div className='flex items-center justify-end flex-1 w-full gap-x-2'>
                <span className='text-xl font-bold'>0</span>
                <div className='w-5 h-5 rounded-md bg-quaternary animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid w-full grid-cols-1 mt-6' key='rewards'>
          {rewards.sort((a, b) => b.required_votes - a.required_votes).map((reward, index) => (
            <div 
              key={reward.id} 
              className={cn(
                'flex items-center w-full gap-4 p-4 odd:bg-secondary even:bg-tertiary',
                index === 0 && 'rounded-t-xl',
                index === rewards.length - 1 && 'rounded-b-xl'
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
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  className='text-tertiary'
                >
                  <path 
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M3.47 5.18c.27-.4.64-.74 1.1-.96l6.09-3.05a3 3 0 0 1 2.68 0l6.1 3.05A2.83 2.83 0 0 1 21 6.75v3.5a14.17 14.17 0 0 1-8.42 12.5c-.37.16-.79.16-1.16 0A14.18 14.18 0 0 1 3 9.77V6.75c0-.57.17-1.11.47-1.57Zm2.95 10.3A12.18 12.18 0 0 0 12 20.82a12.18 12.18 0 0 0 5.58-5.32A9.49 9.49 0 0 0 12.47 14h-.94c-1.88 0-3.63.55-5.11 1.49ZM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}

              <h2 className='flex items-center text-base font-semibold sm:text-lg gap-x-2'>
                <span className='truncate max-w-[100px] mobile:max-w-[150px] sm:max-w-[250px] md:max-w-[400px]'>
                  {reward.role.name}
                </span>
                
                <span className={cn(
                  'flex items-center text-xs font-medium gap-x-1 text-tertiary top-6',
                  reward.unlocked ? 'text-green-500' : 'text-yellow-500'
                )}>
                  {reward.unlocked ? (
                    <>
                      <span className='hidden mobile:block'>Unlocked</span>
                      <IoMdUnlock />
                    </>
                  ) : (
                    <>
                      <span className='hidden mobile:block'>Locked</span>
                      <IoMdLock />
                    </>
                  )}
                </span>
              </h2>

              <div className='flex items-center ml-auto text-base font-bold sm:text-xl gap-x-2'>
                {reward.required_votes}
                <TbSquareRoundedChevronUp />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}