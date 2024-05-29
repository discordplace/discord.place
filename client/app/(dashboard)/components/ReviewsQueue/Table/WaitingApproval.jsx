import { useState } from 'react';
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
import { TbLoader } from 'react-icons/tb';
import cn from '@/lib/cn';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import Link from 'next/link';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import * as Dialog from '@radix-ui/react-dialog';
import { IoMdCloseCircle } from 'react-icons/io';
import { FaPencil } from 'react-icons/fa6';
import { LuTrash2 } from 'react-icons/lu';

export default function WaitingApproval({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.length > 10;

  const [loading, setLoading] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const fetchData = useDashboardStore(state => state.fetchData);

  function continueApproveReview(id, reviewId, type) {
    setLoading(true);

    const approveReview = type === 'server' ? approveServerReview : approveBotReview;

    toast.promise(approveReview(id, reviewId), {
      loading: 'Approving review..',
      success: () => {
        fetchData('reviews')
          .then(() => setLoading(false));

        return 'Review approved successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to approve review ${reviewId}.`;
      }
    });
  }

  function continueDenyReview(id, reviewId, type, reason) {
    setLoading(true);

    const denyReview = type === 'server' ? denyServerReview : denyBotReview;

    toast.promise(denyReview(id, reviewId, reason), {
      loading: 'Denying review..',
      success: () => {
        fetchData('reviews')
          .then(() => setLoading(false));

        return 'Review denied successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to deny review ${reviewId}.`;
      }
    });
  }

  function continueDeleteReview(id, reviewId, type) {
    setLoading(true);
  
    const deleteReview = type === 'server' ? deleteServerReview : deleteBotReview;

    toast.promise(deleteReview(id, reviewId), {
      loading: 'Deleting review..',
      success: () => {
        fetchData('reviews')
          .then(() => setLoading(false));

        return 'Review deleted successfully!';
      },
      error: () => {
        setLoading(false);
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
        <div class="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Bot/Server</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Rating</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Review</th>
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

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <button
                        className={cn(
                          'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                          loading && 'pointer-events-none opacity-70'
                        )}
                        onClick={() => continueApproveReview(review.bot ? review.bot.id : review.server.id, review._id, review.bot ? 'bot' : 'server')}
                      >
                        Approve <IoCheckmarkCircle />
                      </button>

                      <Dialog.Root
                        onOpenChange={open => !open && setDenyReason('')}
                      >
                        <Dialog.Trigger asChild>
                          <button className={cn(
                            'outline-none flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                            loading && 'pointer-events-none opacity-70'
                          )}>
                            Deny <IoMdCloseCircle />
                          </button>
                        </Dialog.Trigger>

                        <Dialog.Portal>
                          <Dialog.Overlay className='radix-overlay fixed z-[9999] inset-0 bg-white/50 dark:bg-black/50' />
                          <Dialog.Content className="radix-dialog-content fixed focus:outline-none z-[9999] flex items-center justify-center w-full h-full">
                            <div className='bg-secondary rounded-2xl flex flex-col gap-y-2 p-6 max-h-[85vh] w-[90vw] max-w-[450px]'>
                              <div className='flex items-center justify-between'>
                                <Dialog.Title className='flex items-center text-lg font-semibold text-primary gap-x-2'>
                                  <FaPencil />
                                  Add Reason
                                </Dialog.Title>

                                <Dialog.Close asChild>
                                  <IoMdCloseCircle className='cursor-pointer hover:opacity-70' />
                                </Dialog.Close>
                              </div>
                              <Dialog.Description className='text-sm text-tertiary'>
                                Please provide a reason for denying this review.
                              </Dialog.Description>

                              <textarea
                                className='w-full h-24 p-2 mt-2 text-sm font-medium transition-all rounded-lg outline-none resize-none focus:ring-2 ring-purple-500 bg-quaternary text-secondary'
                                value={denyReason}
                                onChange={event => setDenyReason(event.target.value)}
                              />

                              <div className='flex mt-2 gap-x-2'>
                                <button
                                  className={cn(
                                    'flex justify-center items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-full gap-x-1',
                                    loading && 'pointer-events-none opacity-70'
                                  )}
                                  onClick={() => continueDenyReview(review.bot ? review.bot.id : review.server.id, review._id, review.bot ? 'bot' : 'server')}
                                >
                                  Confirm
                                  {loading && <TbLoader className='animate-spin' />}
                                </button>

                                <Dialog.Close asChild>
                                  <button className={cn(
                                    'flex justify-center items-center px-4 py-1.5 text-sm font-semibold hover:bg-tertiary rounded-lg text-primary w-full gap-x-1',
                                    loading && 'pointer-events-none opacity-70'
                                  )}>
                                    Cancel
                                  </button>
                                </Dialog.Close>
                              </div>
                            </div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>

                      {dashboardData?.permissions?.canDeleteReviews && (
                        <button
                          className={cn(
                            'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                            loading && 'pointer-events-none opacity-70'
                          )}
                          onClick={() => continueDeleteReview(review.bot ? review.bot?.id || review.bot : review.server?.id || review.server, review._id, review.bot ? 'bot' : 'server')}
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