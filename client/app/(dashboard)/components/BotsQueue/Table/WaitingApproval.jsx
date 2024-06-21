import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Image from 'next/image';
import config from '@/config';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { IoMdCloseCircle } from 'react-icons/io';
import approveBot from '@/lib/request/bots/approveBot';
import denyBot from '@/lib/request/bots/denyBot';
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

  function continueApproveBot(id) {
    setLoading(true);

    toast.promise(approveBot(id), {
      loading: 'Approving bot..',
      success: () => {
        fetchData(['bots'])
          .then(() => setLoading(false));

        return 'Bot approved successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to approve bot ${id}.`;
      }
    });
  }

  function continueDenyBot(id, reason) {
    setLoading(true);

    toast.promise(denyBot(id, reason), {
      loading: 'Denying bot..',
      success: () => {
        fetchData(['bots'])
          .then(() => setLoading(false));

        return 'Bot denied successfully!';
      },
      error: () => {
        setLoading(false);
        return `Failed to deny bot ${id}.`;
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
            message='There are no bots waiting for approval.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Bot</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Owner</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Description</th>
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
              {displayedData?.map(bot => (
                <tr key={bot.id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    <Link
                      className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                      href={`/bots/${bot.id}`}
                    >
                      <Image
                        src={bot.avatar_url}
                        alt={`${bot.username}'s avatar`}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />

                      <div className='flex flex-col gap-y-1'>
                        <h2 className='text-base font-semibold'>{bot.username}</h2>
                        <span className='text-xs font-medium text-tertiary'>{bot.id}</span>
                      </div>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <Link
                      className='flex items-center transition-opacity gap-x-2 hover:opacity-70'
                      href={`/profile/u/${bot.owner.id}`}
                    >
                      <Image
                        src={bot.owner.avatar_url}
                        alt={`${bot.owner.username}'s avatar`}
                        width={24}
                        height={24}
                        className='rounded-full'
                      />

                      <span className='text-sm font-medium'>
                        {bot.owner.username}
                      </span>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    <p className='max-w-[500px] text-sm font-medium'>
                      {bot.short_description}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {bot.categories.join(', ')}
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(bot.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <Link
                        href={`https://discord.com/api/oauth2/authorize?client_id=${bot.id}&permissions=0&scope=bot%20applications.commands&guild_id=${config.botTestGuildId}&disable_guild_select=true`}
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                      >
                        Invite
                        <TbExternalLink />
                      </Link>

                      <button
                        className={cn(
                          'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                          loading && 'pointer-events-none opacity-70'
                        )}
                        onClick={() => continueApproveBot(bot.id)}
                      >
                        Approve <IoCheckmarkCircle />
                      </button>

                      <DenyDropdown
                        description='Please select a reason to deny this bot.'
                        reasons={config.botsDenyReasons}
                        onDeny={reason => continueDenyBot(bot.id, reason)}
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
