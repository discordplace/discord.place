import useDashboardStore from '@/stores/dashboard';
import Pagination from '@/app/components/Pagination';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import Countdown from '@/app/components/Countdown';
import { toast } from 'sonner';
import deleteBotDenyRecord from '@/lib/request/bots/deleteBotDenyRecord';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdCloseCircle } from 'react-icons/io';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function BotDenies() {
  const data = useDashboardStore(state => state.data);

  const [page, setPage] = useState(1);
  const displayedData = data?.botDenies?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.botDenies?.length > 10;

  const [loading, setLoading] = useState(false);
  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteBotDenyRecord(id) {
    disableButton('delete-deny-record', 'confirm'); 
    setLoading(true);
  
    toast.promise(deleteBotDenyRecord(id), {
      loading: 'Deleting bot deny record..',
      success: () => {
        closeModal('delete-deny-record');
        fetchData(['blockedips'])
          .then(() => setLoading(false));

        return 'Bot deny record has been deleted successfully.';
      },
      error: () => {
        enableButton('delete-deny-record', 'confirm');
        setLoading(false);
        
        return 'An error occurred while deleting the bot deny record.';
      }
    });
  }

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Bot Denies
            <span className="text-base font-normal text-tertiary">
              {data?.botDenies?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the bot denies that have been recorded. (last 6 hours only)
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-y-2">
        {(data?.botDenies?.length || 0) === 0 ? (
          <div className='flex flex-col mt-16 gap-y-2'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              } 
              message='There are no bot denies that have been recorded yet.'
            />
          </div>
        ) : (
          <div class="relative w-full overflow-x-auto">
            <table className='w-full table-auto'>
              <thead className='text-left select-none bg-secondary'>
                <tr>
                  <th scope='col' className='px-6 py-4 font-semibold'>Bot</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Submitter</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Reviewer</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Reason</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Expire In</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>
                    <div className='flex gap-x-1.5 items-center'>
                      Actions
                      {loading && <TbLoader className='animate-spin' />}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
                {displayedData?.map(record => (
                  <tr key={record._id} className='text-sm text-secondary'>
                    <td className='px-6 py-4'>
                      {record.bot?.username ? (
                        <Link
                          className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                          href={`/profile/u/${record.bot.id}`}
                        >
                          <Image
                            src={record.bot.avatar_url}
                            alt={`${record.bot.username}'s avatar`}
                            width={32}
                            height={32}
                            className='rounded-full'
                          />

                          <div className='flex flex-col gap-y-1'>
                            <h2 className='text-base font-semibold'>{record.bot.username}</h2>
                            <span className='text-xs font-medium text-tertiary'>{record.bot.id}</span>
                          </div>
                        </Link>
                      ) : (
                        record.bot
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      {record.user?.username ? (
                        <Link
                          className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                          href={`/profile/u/${record.user.id}`}
                        >
                          <Image
                            src={record.user.avatar_url}
                            alt={`${record.user.username}'s avatar`}
                            width={32}
                            height={32}
                            className='rounded-full'
                          />

                          <div className='flex flex-col gap-y-1'>
                            <h2 className='text-base font-semibold'>{record.user.username}</h2>
                            <span className='text-xs font-medium text-tertiary'>{record.user.id}</span>
                          </div>
                        </Link>
                      ) : (
                        record.user
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      {record.reviewer?.username ? (
                        <Link
                          className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                          href={`/profile/u/${record.reviewer.id}`}
                        >
                          <Image
                            src={record.reviewer.avatar_url}
                            alt={`${record.reviewer.username}'s avatar`}
                            width={32}
                            height={32}
                            className='rounded-full'
                          />

                          <div className='flex flex-col gap-y-1'>
                            <h2 className='text-base font-semibold'>{record.reviewer.username}</h2>
                            <span className='text-xs font-medium text-tertiary'>{record.reviewer.id}</span>
                          </div>
                        </Link>
                      ) : (
                        record.reviewer
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex flex-col gap-y-1'>
                        <h2 className='text-base font-semibold'>{record.reason.title}</h2>
                        <span className='max-w-[300px] text-xs font-medium text-tertiary'>
                          {record.reason.description}
                        </span>
                      </div>
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                    </td>

                    <td className='px-6 py-4'>
                      <Countdown
                        date={new Date(new Date(record.createdAt).getTime() + 1000 * 21600)}
                        renderer={({ days, hours, minutes, seconds, completed }) => {
                          if (completed) return 'Expired';

                          return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                        }}
                      />
                    </td>

                    <button
                      className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                      onClick={() => 
                        openModal('delete-deny-record', {
                          title: 'Delete Deny Record',
                          description: 'Are you sure you want to delete this deny record?',
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
                              action: () => continueDeleteBotDenyRecord(record._id)
                            }
                          ]
                        })
                      }
                    >
                      Delete <IoMdCloseCircle />
                    </button>
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
    </div>
  );
}