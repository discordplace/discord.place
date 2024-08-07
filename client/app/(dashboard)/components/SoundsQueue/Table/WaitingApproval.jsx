import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import config from '@/config';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { IoMdCloseCircle } from 'react-icons/io';
import approveSound from '@/lib/request/sounds/approveSound';
import denySound from '@/lib/request/sounds/denySound';
import { toast } from 'sonner';
import useDashboardStore from '@/stores/dashboard';
import { TbExternalLink, TbLoader } from 'react-icons/tb';
import cn from '@/lib/cn';
import DenyDropdown from '@/app/(dashboard)/components/Dropdown/Deny';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import Link from 'next/link';

export default function WaitingApproval({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.length > 10;

  const [loading, setLoading] = useState(false);
  const fetchData = useDashboardStore(state => state.fetchData);

  function continueApproveSound(id) {
    setLoading(true);

    toast.promise(approveSound(id), {
      loading: 'Approving sound..',
      success: () => {
        fetchData(['sounds'])
          .then(() => setLoading(false));

        return 'Sound approved successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to approve sound ${id}.`;
      }
    });
  }

  function continueDenySound(id, reason) {
    setLoading(true);

    toast.promise(denySound(id, reason), {
      loading: 'Denying sound..',
      success: () => {
        fetchData(['sounds'])
          .then(() => setLoading(false));

        return 'Sound denied successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to deny sound ${id}.`;
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
            message='There are no sounds waiting for approval.'
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
                <th scope='col' className='px-6 py-4 font-semibold'>
                  <div className='flex gap-x-1.5 items-center'>
                    Actions
                    {loading && <TbLoader className='animate-spin' />}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(sound => (
                <tr key={sound.id} className='text-sm text-secondary'>
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
                        className={cn(
                          'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                          loading && 'pointer-events-none opacity-70'
                        )}
                        onClick={() => continueApproveSound(sound.id)}
                      >
                        Approve <IoCheckmarkCircle />
                      </button>

                      <DenyDropdown
                        description='Please select a reason to deny this sound.'
                        reasons={config.soundsDenyReasons}
                        onDeny={reason => continueDenySound(sound.id, reason)}
                      >
                        <button
                          className={cn(
                            'flex outline-none items-center px-4 py-1.5 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 hover:bg-tertiary',
                            loading && 'pointer-events-none opacity-70'
                          )}
                        >
                          Deny <IoMdCloseCircle />
                        </button>
                      </DenyDropdown>
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
