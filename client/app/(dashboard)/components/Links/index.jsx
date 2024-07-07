import useDashboardStore from '@/stores/dashboard';
import Pagination from '@/app/components/Pagination';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'sonner';
import deleteLink from '@/lib/request/links/deleteLink';
import Link from 'next/link';
import { IoMdCloseCircle } from 'react-icons/io';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function Links() {
  const data = useDashboardStore(state => state.data);

  const [page, setPage] = useState(1);
  const displayedData = data?.links?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.links?.length > 10;

  const [loading, setLoading] = useState(false);
  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueDeleteLink(id) {
    disableButton('delete-link', 'confirm'); 
    setLoading(true);
  
    toast.promise(deleteLink(id), {
      loading: 'Deleting link...',
      success: () => {
        closeModal('delete-link');
        fetchData(['links'])
          .then(() => setLoading(false));

        return 'Link has been deleted successfully.';
      },
      error: () => {
        enableButton('delete-link', 'confirm');
        setLoading(false);
        
        return 'An error occurred while deleting the link.';
      }
    });
  }

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Links
            <span className="text-base font-normal text-tertiary">
              {data?.links?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the links that have been created.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-y-2">
        {(data?.links?.length || 0) === 0 ? (
          <div className='flex flex-col mt-16 gap-y-2'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              } 
              message='There are no links that have been created yet.'
            />
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <table className='w-full table-auto'>
              <thead className='text-left select-none bg-secondary'>
                <tr>
                  <th scope='col' className='px-6 py-4 font-semibold'>Created By</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Name</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Destination URL</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Visits</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>
                    <div className='flex gap-x-1.5 items-center'>
                      Actions
                      {loading && <TbLoader className='animate-spin' />}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
                {displayedData?.map(link => (
                  <tr key={link._id} className='text-sm text-secondary'>
                    <td className='px-6 py-4'>
                      <Link 
                        href={`/profile/u/${link.createdBy}`}
                        className='transition-opacity text-tertiary hover:opacity-70'
                      >
                        {link.createdBy}
                      </Link>
                    </td>

                    <td className='px-6 py-4'>
                      {link.name}
                    </td>

                    <td className='px-6 py-4'>
                      {link.redirectTo}
                    </td>

                    <td className='px-6 py-4'>
                      {link.visits}
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(link.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                    </td>

                    <td className='px-6 py-4'>
                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('delete-link', {
                            title: 'Delete Link',
                            description: 'Are you sure you want to delete this link?',
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
                                action: () => continueDeleteLink(link.id)
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