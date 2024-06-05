import useDashboardStore from '@/stores/dashboard';
import Pagination from '@/app/components/Pagination';
import cn from '@/lib/cn';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useState } from 'react';
import Countdown from '@/app/components/Countdown';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';
import deleteBotTimeout from '@/lib/request/bots/deleteTimeout';
import deleteServerTimeout from '@/lib/request/servers/deleteTimeout';
import Image from 'next/image';
import Link from 'next/link';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function Timeouts() {
  const data = useDashboardStore(state => state.data);

  const [page, setPage] = useState(1);
  const displayedData = data?.timeouts?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.timeouts?.length > 10;

  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteTimeout(id, userId, type) {
    disableButton('delete-timeout', 'confirm');

    const deleteTimeout = type === 'server' ? deleteServerTimeout : deleteBotTimeout;
  
    toast.promise(deleteTimeout(id, userId), {
      loading: 'Deleting the timeout...',
      success: () => {
        closeModal('delete-timeout');
        fetchData(['timeouts']);

        return 'The timeout has been deleted successfully.';
      },
      error: () => {
        enableButton('delete-timeout', 'confirm');
        return 'An error occurred while deleting the timeout.';
      }
    });
  }

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Timeouts
            <span className="text-base font-normal text-tertiary">
              {data?.timeouts?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the vote timeouts that have been recorded.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-y-2">
        {(data?.timeouts?.length || 0) === 0 ? (
          <div className='flex flex-col mt-16 gap-y-2'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              } 
              message='There are no vote timeouts to display.'
            />
          </div>
        ) : (
          <div class="relative w-full overflow-x-auto">
            <table className='w-full table-auto'>
              <thead className='text-left select-none bg-secondary'>
                <tr>
                  <th scope='col' className='px-6 py-4 font-semibold'>Bot/Server</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>User</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Expire In</th>
                  {data.permissions.canDeleteTimeouts && <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>}
                </tr>
              </thead>

              <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
                {displayedData?.map(timeout => (
                  <tr key={timeout._id} className='text-sm text-secondary'>
                    <td className='px-6 py-4'>
                      <Link
                        className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                        href={timeout.bot ? `/bots/${timeout.bot?.id || timeout.bot}` : `/servers/${timeout.guild?.id || timeout.guild}`}
                      >
                        {(timeout.bot?.username || timeout.guild?.name) ? (
                          <>
                            {timeout.bot ? (
                              <Image
                                src={timeout.bot.avatar_url}
                                alt={`${timeout.bot.username}'s avatar`}
                                width={32}
                                height={32}
                                className='rounded-full'
                              />
                            ) : (
                              <ServerIcon
                                width={32}
                                height={32}
                                icon_url={timeout.guild.icon_url}
                                name={timeout.guild.name}
                                className='rounded-full [&>h2]:text-sm'
                              />
                            )}

                            <div className='flex flex-col gap-y-1'>
                              <h2 className='flex items-center text-base font-semibold gap-x-2'>
                                {timeout.bot ? timeout.bot.username : timeout.guild.name}

                                <span className={cn(
                                  'text-xs font-bold px-2 py-0.5 rounded-full text-tertiary',
                                  timeout.bot ? 'bg-[#5865F2] text-white' : 'dark:bg-white/30 bg-black/30 text-black dark:text-white'
                                )}>
                                  {timeout.bot ? 'Bot' : 'Server'}
                                </span>
                              </h2>
                              <span className='text-xs font-medium text-tertiary'>{timeout.bot ? timeout.bot.id : timeout.guild.id}</span>
                            </div>
                          </>
                        ) : (
                          timeout.bot || timeout.guild
                        )}
                      </Link>
                    </td>

                    <td className='px-6 py-4'>
                      {timeout.user?.username ? (
                        <Link
                          className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                          href={`/profile/u/${timeout.user.id}`}
                        >
                          <Image
                            src={timeout.user.avatar_url}
                            alt={`${timeout.user.username}'s avatar`}
                            width={32}
                            height={32}
                            className='rounded-full'
                          />

                          <div className='flex flex-col gap-y-1'>
                            <h2 className='text-base font-semibold'>{timeout.user.username}</h2>
                            <span className='text-xs font-medium text-tertiary'>{timeout.user.id}</span>
                          </div>
                        </Link>
                      ) : (
                        timeout.user
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(timeout.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                    </td>

                    <td className='px-6 py-4'>
                      <Countdown
                        date={new Date(new Date(timeout.createdAt).getTime() + 1000 * 86400)}
                        renderer={({ hours, minutes, seconds, completed }) => {
                          if (completed) return 'Expired';

                          return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                        }}
                      />
                    </td>

                    {data.permissions.canDeleteTimeouts && (
                      <td className='px-6 py-4'>
                        <button
                          className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                          onClick={() => 
                            openModal('delete-timeout', {
                              title: 'Delete Timeout',
                              description: `Are you sure you want to delete the timeout for ${timeout.bot ? (timeout.bot.username || timeout.bot) : (timeout.guild?.name || timeout.guild)} by ${timeout.user?.username || timeout.user}?`,
                              content: (
                                <p className='text-sm text-tertiary'>
                                  Please note that deleting the timeout will remove the vote timeout for the user.
                                </p>
                              ),
                              buttons: [
                                {
                                  id: 'cancel',
                                  label: 'Cancel',
                                  variant: 'ghost',
                                  actionType: 'close'
                                },
                                {
                                  id: 'confirm',
                                  label: 'Confirm',
                                  variant: 'solid',
                                  action: () => continueDeleteTimeout(timeout.bot ? timeout.bot?.id || timeout.bot : timeout.guild?.id || timeout.guild, timeout.user.id, timeout.bot ? 'bot' : 'server')
                                }
                              ]
                            })
                          }
                        >
                          Delete <LuTrash2 />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showPagination && (
          <Pagination
            page={page}
            totalPages={Math.ceil(data?.timeouts?.length / 10)}
            setPage={setPage}
            loading={false}
            total={data?.timeouts?.length}
            limit={10}
            disableAnimation
          />
        )}
      </div>
    </div>
  );
}