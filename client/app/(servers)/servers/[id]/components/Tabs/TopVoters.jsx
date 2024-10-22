'use client';

import Pagination from '@/app/components/Pagination';
import { useEffect, useState } from 'react';
import cn from '@/lib/cn';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import fetchVoters from '@/lib/request/servers/fetchVoters';
import { toast } from 'sonner';
import Link from 'next/link';
import { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function TopVoters({ server }) {
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    setLoading(true);

    fetchVoters(server.id, page, limit)
      .then(data => {
        setVoters(data.voters);
        setTotalPages(data.totalPages);
        setTotalVoters(data.total);
      })
      .catch(error => toast.error(error))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className='w-full px-8 lg:max-w-[70%] lg:px-0'>
      <h2 className='text-xl font-semibold'>
        {t('serverPage.tabs.topVoters.title')}
      </h2>

      {loading ? (
        <div className='mt-4 grid w-full grid-cols-1' key='loading'>
          {new Array(limit).fill().map((_, index) => (
            <div key={index} className='flex h-[72px] w-full items-center gap-4 px-4 first:rounded-t-xl last:rounded-b-xl odd:bg-secondary even:bg-tertiary'>
              <div className='size-10 animate-pulse rounded-full bg-quaternary' />
              <div className='h-4 w-1/3 animate-pulse rounded-lg bg-quaternary' />
              <div className='flex w-full flex-1 items-center justify-end gap-x-2'>
                <span className='text-xl font-bold'>0</span>
                <div className='size-5 animate-pulse rounded-md bg-quaternary' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-4 grid w-full grid-cols-1' key='voters'>
          {voters.map((voter, index) => (
            <Link
              href={`/profile/u/${voter.user.id}`}
              key={voter.id}
              className={cn(
                'flex items-center w-full gap-4 p-4 odd:bg-secondary even:bg-tertiary hover:opacity-70 transition-opacity',
                index === 0 && 'rounded-t-xl',
                index === voters.length - 1 && 'rounded-b-xl',
                page === 1 && voters.length > 3 && voters.indexOf(voter) === 0 && 'border-x-2 border-t-2 border-yellow-500 odd:bg-yellow-500/10',
                page === 1 && voters.length > 3 && voters.indexOf(voter) === 1 && 'border-x-2 border-gray-500 odd:bg-gray-500/10',
                page === 1 && voters.length > 3 && voters.indexOf(voter) === 2 && 'border-x-2 border-b-2 border-yellow-900 odd:bg-yellow-900/10'
              )}
            >
              <div className='relative'>
                <UserAvatar
                  id={voter.user.id}
                  hash={voter.user.avatar}
                  size={64}
                  width={40}
                  height={40}
                  className='rounded-full'
                />

                {[0, 1, 2].includes(voters.indexOf(voter)) && (
                  <div
                    className={cn(
                      'absolute top-0 left-0 w-full h-full rounded-full',
                      page === 1 && 'border-2',
                      page === 1 && voters.indexOf(voter) === 0 && 'border-yellow-500',
                      page === 1 && voters.indexOf(voter) === 1 && 'border-gray-500',
                      page === 1 && voters.indexOf(voter) === 2 && 'border-yellow-900'
                    )}
                  />
                )}
              </div>

              <h2 className='truncate text-lg font-semibold'>
                @{voter.user.username}
              </h2>

              <div className='ml-auto flex items-center gap-x-2 text-xl font-bold'>
                {voter.votes}
                <TbSquareRoundedChevronUp />
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className='flex w-full items-center justify-center'>
          <Pagination
            page={page}
            setPage={setPage}
            loading={false}
            total={totalVoters}
            limit={limit}
            disableAnimation
          />
        </div>
      )}
    </div>
  );
}