import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';

export default function UserActivity({ data }) {
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
            message='There are no user activities to display.'
          />
        </div>
      ) : (
        <div class="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>User</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Target</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Message</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(activity => (
                <tr key={activity._id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    {activity.user?.username ? (
                      <Link
                        className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                        href={`/profile/u/${activity.user.id}`}
                      >
                        <Image
                          src={activity.user.avatar_url}
                          alt={`${activity.user.username}'s avatar`}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />

                        <div className='flex flex-col gap-y-1'>
                          <h2 className='text-base font-semibold'>
                            {activity.user.username}
                          </h2>
                          <span className='text-xs font-medium text-tertiary'>{activity.user.id}</span>
                        </div>
                      </Link>
                    ) : activity.user.id}
                  </td>

                  <td className='px-6 py-4'>
                    {activity.target?.avatar_url ? (
                      <Link
                        className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                        href={`/profile/u/${activity.target.id}`}
                      >
                        <Image
                          src={activity.target.avatar_url}
                          alt={`${activity.target.username}'s avatar`}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />

                        <div className='flex flex-col gap-y-1'>
                          <h2 className='text-base font-semibold'>
                            {activity.target.username}
                          </h2>
                          <span className='text-xs font-medium text-tertiary'>{activity.target.id}</span>
                        </div>
                      </Link>
                    ) : (activity.target.icon_url ? (
                      <div className='flex items-center gap-x-4'>
                        <ServerIcon
                          width={32}
                          height={32}
                          icon_url={activity.target.icon_url}
                          name={activity.target.name}
                          className='rounded-full [&>h2]:text-sm'
                        />

                        <div className='flex flex-col gap-y-1'>
                          <h2 className='text-base font-semibold'>
                            {activity.target.name}
                          </h2>
                          <span className='text-xs font-medium text-tertiary'>{activity.target.id}</span>
                        </div>
                      </div>
                    ) : activity.target.id)}
                  </td>

                  <td className='px-6 py-4'>
                    <p className='max-w-[500px] text-sm font-medium'>
                      {activity.message}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(activity.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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