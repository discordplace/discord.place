import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuTrash2 } from 'react-icons/lu';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import deleteSound from '@/lib/request/sounds/deleteSound';
import useDashboardStore from '@/stores/dashboard';
import { toast } from 'sonner';
import { TbExternalLink } from 'react-icons/tb';

export default function Approved({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);

  const showPagination = data?.length > 10;
  
  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteSound(id) {
    disableButton('delete-sound', 'confirm');

    toast.promise(deleteSound(id), {
      loading: 'Deleting sound..',
      success: () => {
        closeModal('delete-sound');
        fetchData(['sounds']);

        return 'Sound deleted successfully!';
      },
      error: error => {
        enableButton('delete-sound', 'confirm');

        return error;
      }
    });
  }

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
            message='There are no sounds that have been approved yet.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Name</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Categories</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(sound => (
                <tr
                  key={sound.id}
                  className='text-sm text-secondary'
                >
                  <td className='px-6 py-4'>
                    <Link 
                      className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                      href={`/profile/u/${sound.publisher.id}`}
                    >
                      @{sound.publisher.username}
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    {sound.name}
                  </td>

                  <td className='px-6 py-4'>
                    {sound.categories.join(', ')}
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(sound.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>
                  
                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <Link
                        href={`/sounds/${sound.id}`}
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                      >
                        View
                        <TbExternalLink />
                      </Link>
                      
                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('delete-sound', {
                            title: 'Delete Sound',
                            description: 'Are you sure you want to delete this sound?',
                            content: (
                              <p className='text-sm text-tertiary'>
                                Please note that deleting this sound will remove it from the queue and it will not be visible to anyone.
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
                                action: () => continueDeleteSound(sound.id)
                              }
                            ]
                          })
                        }
                      >
                        Delete <LuTrash2 />
                      </button>
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