import Pagination from '@/app/components/Pagination';
import { useEffect, useState } from 'react';
import cn from '@/lib/cn';
import Image from 'next/image';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';

export default function TopVoters({ bot }) {
  const [page, setPage] = useState(1);
  const limit = 12;
  const maxPages = bot.voters.length / limit;
  const [voters, setVoters] = useState(bot.voters.slice(0, limit));

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setVoters(bot.voters.slice(start, end));
        
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className='lg:max-w-[70%] w-full px-8 lg:px-0'>
      <h2 className='text-xl font-semibold'>
        Top Voters
      </h2>

      <div className='grid w-full grid-cols-1 mt-4'>
        {voters.map((voter, index) => (
          <div 
            key={voter.user.id} 
            className={cn(
              'flex items-center w-full gap-4 p-4 odd:bg-secondary even:bg-tertiary',
              index === 0 && 'rounded-t-xl',
              index === voters.length - 1 && 'rounded-b-xl',
              voters.length > 3 && bot.voters.indexOf(voter) === 0 && 'border-x-2 border-t-2 border-yellow-500 odd:bg-yellow-500/10',
              voters.length > 3 && bot.voters.indexOf(voter) === 1 && 'border-x-2 border-gray-500 odd:bg-gray-500/10',
              voters.length > 3 && bot.voters.indexOf(voter) === 2 && 'border-x-2 border-b-2 border-yellow-900 odd:bg-yellow-900/10'
            )}
          >
            <div className='relative'>
              <Image
                src={voter.user.avatar_url} 
                alt={`${voter.user.username}'s avatar`} 
                width={40} 
                height={40} 
                className='rounded-full'
              />

              {[0, 1, 2].includes(bot.voters.indexOf(voter)) && (
                <div className={cn(
                  'absolute top-0 left-0 w-full h-full rounded-full border-2',
                  bot.voters.indexOf(voter) === 0 && 'border-yellow-500',
                  bot.voters.indexOf(voter) === 1 && 'border-gray-500',
                  bot.voters.indexOf(voter) === 2 && 'border-yellow-900'
                )} />
              )}
            </div>

            <h2 className='text-lg font-semibold truncate'>
              @{voter.user.username}
            </h2>

            <div className='flex items-center ml-auto text-xl font-bold gap-x-2'>
              {voter.vote}
              <TbSquareRoundedChevronUp />
            </div>
          </div>
        ))}

        {maxPages > 1 && (
          <div className='flex items-center justify-center w-full'>
            <Pagination 
              page={page} 
              setPage={setPage}
              loading={false} 
              total={bot.voters.length} 
              limit={limit} 
            />
          </div>
        )}
      </div>
    </div>
  );
}