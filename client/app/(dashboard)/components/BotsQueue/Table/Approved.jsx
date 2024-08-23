import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import { TbExternalLink } from 'react-icons/tb';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function Approved({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);

  const showPagination = data?.length > 10;

  return (
    <div className="flex flex-col items-center w-full -mt-8 gap-y-2">
      {data?.length === 0 ? (
        <div className='flex flex-col mt-16 gap-y-2'>
          <ErrorState 
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                It{'\''}s quiet in here...
              </div>
            } 
            message='There are no bots that have been verified yet.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Bot</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Owner</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Description</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Categories</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(bot => (
                <tr key={bot.id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    <Link
                      className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                      href={`/bots/${bot.id}`}
                    >
                      <UserAvatar
                        id={bot.id}
                        hash={bot.avatar}
                        size={32}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />

                      <div className='flex flex-col gap-y-1'>
                        <h2 className='text-base font-semibold'>{bot.username}</h2>
                        <span className='text-xs font-medium text-tertiary'>{bot.id}</span>
                      </div>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <Link
                      className='flex items-center transition-opacity gap-x-2 hover:opacity-70'
                      href={`/profile/u/${bot.owner.id}`}
                    >
                      <UserAvatar
                        id={bot.owner.id}
                        hash={bot.owner.avatar}
                        size={32}
                        width={24}
                        height={24}
                        className='rounded-full'
                      />

                      <div className='flex flex-col gap-y-1'>
                        <h2 className='text-base font-semibold'>{bot.owner.username}</h2>
                        <span className='text-xs font-medium text-tertiary'>{bot.owner.id}</span>
                      </div>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <p className='max-w-[500px] text-sm font-medium'>
                      {bot.short_description}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {bot.categories.join(', ')}
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(bot.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>
                  
                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <Link
                        href={`/bots/${bot.id}`}
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                      >
                        View
                        <TbExternalLink />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPagination && (
        <Pagination
          page={page}
          totalPages={Math.ceil(data?.length / 10)}
          setPage={setPage}
          loading={false}
          total={data?.length}
          limit={10}
          disableAnimation
        />
      )}
    </div>
  );
}