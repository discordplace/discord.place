import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Image from 'next/image';
import config from '@/config';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { IoMdCloseCircle } from 'react-icons/io';
import approveEmoji from '@/lib/request/emojis/approveEmoji';
import denyEmoji from '@/lib/request/emojis/denyEmoji';
import { toast } from 'sonner';
import useDashboardStore from '@/stores/dashboard';
import { TbLoader } from 'react-icons/tb';
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

  function continueApproveEmoji(id) {
    setLoading(true);

    toast.promise(approveEmoji(id), {
      loading: 'Approving emoji..',
      success: () => {
        fetchData(['emojis'])
          .then(() => setLoading(false));

        return 'Emoji approved successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to approve emoji ${id}.`;
      }
    });
  }

  function continueDenyEmoji(id, reason) {
    setLoading(true);

    toast.promise(denyEmoji(id, reason), {
      loading: 'Denying emoji..',
      success: () => {
        fetchData(['emojis'])
          .then(() => setLoading(false));

        return 'Emoji denied successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to deny emoji ${id}.`;
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
            message='There are no emojis waiting for approval.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Name</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Image(s)</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Categories</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher ID</th>
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
              {displayedData?.map(emoji => (
                <tr key={emoji.id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    {emoji.name}
                  </td>
                  
                  <td className='px-6 py-4'>                  
                    {emoji.emoji_ids ? (
                      <div className='grid grid-cols-3 gap-4 w-max'>
                        {emoji.emoji_ids.map(packedEmoji => (
                          <Image
                            key={packedEmoji.id}
                            src={config.getEmojiURL(`packages/${emoji.id}/${packedEmoji.id}`, packedEmoji.animated)} 
                            alt={`Emoji ${emoji.name}`}
                            width={32}
                            height={32}
                          />
                        ))}
                      </div>
                    ) : (
                      <Image
                        src={config.getEmojiURL(emoji.id, emoji.animated)}
                        alt={`Emoji ${emoji.name}`}
                        width={32}
                        height={32}
                      />
                    )}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      {emoji.categories.join(', ')}
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <Link
                      className='flex items-center text-sm font-medium transition-opacity text-tertiary gap-x-2 hover:opacity-70'
                      href={`/profile/u/${emoji.user.id}`}
                    >
                      <span className='text-sm font-medium'>
                        {emoji.user.id}
                      </span>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(emoji.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <button
                        className={cn(
                          'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                          loading && 'pointer-events-none opacity-70'
                        )}
                        onClick={() => continueApproveEmoji(emoji.id)}
                      >
                        Approve <IoCheckmarkCircle />
                      </button>

                      <DenyDropdown
                        description='Please select a reason to deny this emoji.'
                        reasons={config.emojisDenyReasons}
                        onDeny={reason => continueDenyEmoji(emoji.id, reason)}
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