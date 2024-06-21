import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Link from 'next/link';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import deleteServerReview from '@/lib/request/servers/deleteReview';
import deleteBotReview from '@/lib/request/bots/deleteReview';
import useDashboardStore from '@/stores/dashboard';
import { toast } from 'sonner';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { LuTrash2 } from 'react-icons/lu';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

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

  function continueDeleteReview(id, reviewId, type) {
    disableButton('delete-review', 'confirm');
  
    const deleteReview = type === 'server' ? deleteServerReview : deleteBotReview;

    toast.promise(deleteReview(id, reviewId), {
      loading: 'Deleting review..',
      success: () => {
        closeModal('delete-review');
        fetchData(['reviews']);

        return 'Review deleted successfully!';
      },
      error: () => {
        enableButton('delete-review', 'confirm');
        return `Failed to delete review ${reviewId}.`;
      }
    });
  }

  const dashboardData = useDashboardStore(state => state.data);

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
            message='There are no reviews that have been approved yet.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Bot/Server</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Rating</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Review</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                {dashboardData?.permissions?.canDeleteReviews && <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>}
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(review => (
                <tr key={review._id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    <Link 
                      className='transition-opacity hover:opacity-70'
                      href={review.bot ? `/bots/${review.bot?.id || review.bot}` : `/servers/${review.server?.id || review.server}`}
                    >
                      {review.bot?.id || review.server?.id}
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <Link
                      className='transition-opacity hover:opacity-70'
                      href={`/profile/u/${review.user.id}`}
                    >
                      {review.user.id}
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex'>
                      {new Array(5).fill(null).map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? (
                            <TiStarFullOutline className='text-yellow-500' />
                          ) : (
                            <TiStarOutline className='text-tertiary' />
                          )}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <p className='max-w-[500px]'>
                      {review.content}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>

                  {dashboardData?.permissions?.canDeleteReviews && (
                    <td className='px-6 py-4'>
                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('delete-review', {
                            title: 'Delete Review',
                            description: 'Are you sure you want to delete this review?',
                            content: (
                              <p className='text-sm text-tertiary'>
                                Please note that deleting this review will completely remove it from the database and it cannot be recovered.
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
                                action: () => continueDeleteReview(review.bot ? review.bot?.id || review.bot : review.server?.id || review.server, review._id, review.bot ? 'bot' : 'server')
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