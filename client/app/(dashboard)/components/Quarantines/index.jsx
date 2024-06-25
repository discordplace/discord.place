import useDashboardStore from '@/stores/dashboard';
import Pagination from '@/app/components/Pagination';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useState } from 'react';
import { TbLoader, TbLockPlus } from 'react-icons/tb';
import Countdown from '@/app/components/Countdown';
import { toast } from 'sonner';
import deleteQuarantineRecord from '@/lib/request/dashboard/deleteQuarantineRecord';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdCloseCircle } from 'react-icons/io';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import config from '@/config';
import CreateQuarantineModal from '@/app/(dashboard)/components/Quarantines/CreateQuarantineModal';

export default function Quarantines() {
  const data = useDashboardStore(state => state.data);

  const [page, setPage] = useState(1);
  const displayedData = data?.quarantines?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.quarantines?.length > 10;

  const [loading, setLoading] = useState(false);
  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteQuarantineRecord(id) {
    disableButton('delete-quarantine-record', 'confirm'); 
    setLoading(true);
  
    toast.promise(deleteQuarantineRecord(id), {
      loading: 'Deleting quarantine record...',
      success: () => {
        closeModal('delete-quarantine-record');
        fetchData(['quarantines'])
          .then(() => setLoading(false));

        return 'Quarantine record has been deleted successfully.';
      },
      error: () => {
        enableButton('delete-quarantine-record', 'confirm');
        setLoading(false);
        
        return 'An error occurred while deleting the quarantine record.';
      }
    });
  }

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Quarantines
            <span className="text-base font-normal text-tertiary">
              {data?.quarantines?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the quarantines that have been created and not yet expired.
          </p>
        </div>

        {data?.permissions?.canCreateQuarantines === true && (
          <button
            className='flex items-center px-4 py-2 text-sm font-semibold rounded-lg hover:bg-tertiary bg-quaternary gap-x-2'
            onClick={() =>
              openModal('create-quarantine-record', {
                title: 'Create Quarantine Record',
                description: 'You are going to create a new quarantine record.',
                content: <CreateQuarantineModal />
              })
            }
          >
            Create Quarantine
            <TbLockPlus />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center w-full gap-y-2">
        {(data?.quarantines?.length || 0) === 0 ? (
          <div className='flex flex-col mt-16 gap-y-2'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              } 
              message='There are no quarantines that have been recorded yet.'
            />
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <table className='w-full table-auto'>
              <thead className='text-left select-none bg-secondary'>
                <tr>
                  <th scope='col' className='px-6 py-4 font-semibold'>User/Server</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Created By</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Restriction</th>
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
                  <tr key={record.id} className='text-sm text-secondary'>
                    <td className='px-6 py-4'>
                      {record.type === 'USER_ID' ? (
                        record.user?.username ? (
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
                        )
                      ) : (
                        record.guild?.name ? (
                          <Link
                            className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                            href={`/server/${record.guild.id}`}
                          >
                            <Image
                              src={record.guild.icon_url}
                              alt={`${record.guild.name}'s icon`}
                              width={32}
                              height={32}
                              className='rounded-full'
                            />
  
                            <div className='flex flex-col gap-y-1'>
                              <h2 className='text-base font-semibold'>{record.guild.name}</h2>
                              <span className='text-xs font-medium text-tertiary'>{record.guild.id}</span>
                            </div>
                          </Link>
                        ) : (
                          record.guild
                        )
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      {record.created_by?.username ? (
                        <Link
                          className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                          href={`/profile/u/${record.created_by.id}`}
                        >
                          <Image
                            src={record.created_by.avatar_url}
                            alt={`${record.created_by.username}'s avatar`}
                            width={32}
                            height={32}
                            className='rounded-full'
                          />

                          <div className='flex flex-col gap-y-1'>
                            <h2 className='text-base font-semibold'>{record.created_by.username}</h2>
                            <span className='text-xs font-medium text-tertiary'>{record.created_by.id}</span>
                          </div>
                        </Link>
                      ) : (
                        record.created_by
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      {config.quarantineRestrictions[record.restriction].description}
                    </td>

                    <td className='px-6 py-4'>
                      <span className='max-w-[300px] font-medium text-tertiary'>
                        {record.reason}
                      </span>
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(record.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                    </td>

                    <td className='px-6 py-4'>
                      {record.expire_at ? (
                        <Countdown
                          date={record.expire_at}
                          renderer={({ days, hours, minutes, seconds, completed }) => {
                            if (completed) return 'Expired';

                            return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                          }}
                        />
                      ) : (
                        'No expiration date'
                      )}
                    </td>

                    <td className='px-6 py-4'>
                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('delete-quarantine-record', {
                            title: 'Delete Quarantine Record',
                            description: 'Are you sure you want to delete this quarantine record?',
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
                                action: () => continueDeleteQuarantineRecord(record.id)
                              }
                            ]
                          })
                        }
                      >
                        Delete <IoMdCloseCircle />
                      </button>
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
    </div>
  );
}