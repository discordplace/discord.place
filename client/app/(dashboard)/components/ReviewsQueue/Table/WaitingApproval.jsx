import { useState, useRef } from 'react';
import Pagination from '@/app/components/Pagination';
import { IoCheckmarkCircle } from 'react-icons/io5';
import approveServerReview from '@/lib/request/servers/approveReview';
import denyServerReview from '@/lib/request/servers/denyReview';
import deleteServerReview from '@/lib/request/servers/deleteReview';
import approveBotReview from '@/lib/request/bots/approveReview';
import denyBotReview from '@/lib/request/bots/denyReview';
import deleteBotReview from '@/lib/request/bots/deleteReview';
import { toast } from 'sonner';
import useDashboardStore from '@/stores/dashboard';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import Link from 'next/link';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { IoMdCloseCircle } from 'react-icons/io';
import { LuTrash2 } from 'react-icons/lu';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';

export default function WaitingApproval({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.length > 10;

  const denyReasonInputRef = useRef(null);
  const fetchData = useDashboardStore(state => state.fetchData);

  const { openModal, disableButton, enableButton, closeModal } = useModalsStore(useShallow(state => ({
    openModal: state.openModal,
    disableButton: state.disableButton,
    enableButton: state.enableButton,
    closeModal: state.closeModal
  })));

  function continueApproveReview(id, reviewId, type) {
    disableButton('approve-review', 'confirm');

    const approveReview = type === 'server' ? approveServerReview : approveBotReview;

    toast.promise(approveReview(id, reviewId), {
      loading: 'Approving review..',
      success: () => {
        closeModal('approve-review');
        fetchData(['reviews']);

        return 'Review approved successfully!';
      },
      error: () => {
        enableButton('approve-review', 'confirm');

        return `Failed to approve review ${reviewId}.`;
      }
    });
  }

  function continueDenyReview(id, reviewId, type) {
    disableButton('deny-review', 'confirm');

    const denyReview = type === 'server' ? denyServerReview : denyBotReview;
    const denyReason = denyReasonInputRef.current.value;

    toast.promise(denyReview(id, reviewId, denyReason), {
      loading: 'Denying review..',
      success: () => {
        closeModal('deny-review');
        fetchData(['reviews']);

        return 'Review denied successfully!';
      },
      error: () => {
        enableButton('deny-review', 'confirm');
        
        return `Failed to deny review ${reviewId}.`;
      }
    });
  }

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
            message='There are no reviews waiting for approval.'
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
                <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>
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
                    <p className='max-w-[500px] break-words'>
                      {review.content}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('approve-review', {
                            title: 'Approve Review',
                            description: 'Are you sure you want to approve this review?',
                            content: (
                              <p className='text-sm text-tertiary'>
                                Please note that approving this review will make it public and visible to everyone.
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
                                action: () => continueApproveReview(review.bot ? review.bot.id : review.server.id, review._id, review.bot ? 'bot' : 'server')
                              }
                            ]
                          })
                        }
                      >
                        Approve <IoCheckmarkCircle />
                      </button>

                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('deny-review', {
                            title: 'Deny Review',
                            description: 'Please provide a reason for denying this review.',
                            content: (
                              <textarea
                                id='denyReason'
                                className='w-full h-24 p-2 mt-2 text-sm font-medium transition-all rounded-lg outline-none resize-none focus:ring-2 ring-purple-500 bg-quaternary text-secondary'
                                ref={denyReasonInputRef}
                              />
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
                                action: () => continueDenyReview(review.bot ? review.bot.id : review.server.id, review._id, review.bot ? 'bot' : 'server')
                              }
                            ]
                          })
                        }
                      >
                        Deny <IoMdCloseCircle />
                      </button>

                      {dashboardData?.permissions?.canDeleteReviews && (
                        <button
                          className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                          onClick={() =>
                            openModal('delete-review', {
                              title: 'Delete Review',
                              description: 'Are you sure you want to delete this review?',
                              content: (
                                <p className='text-sm text-tertiary'>
                                  Please note that deleting this review will remove it from the queue and it will not be visible to anyone.
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
                                  action: () => continueDeleteReview(review.bot ? review.bot.id : review.server.id, review._id, review.bot ? 'bot' : 'server')
                                }
                              ]
                            })
                          }
                        >
                          Delete <LuTrash2 />
                        </button>
                      )}
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