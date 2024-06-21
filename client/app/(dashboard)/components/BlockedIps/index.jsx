import useDashboardStore from '@/stores/dashboard';
import Pagination from '@/app/components/Pagination';
import cn from '@/lib/cn';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import Countdown from '@/app/components/Countdown';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';
import deleteBlockedIP from '@/lib/request/dashboard/deleteBlockedIP';

export default function BlockedIps() {
  const data = useDashboardStore(state => state.data);

  const [page, setPage] = useState(1);
  const displayedData = data?.blockedIps?.slice((page - 1) * 10, page * 10);
  
  const showPagination = data?.blockedIps?.length > 10;

  const [loading, setLoading] = useState(false);
  const fetchData = useDashboardStore(state => state.fetchData);

  function continueDeleteBlockedIP(ip) {
    setLoading(true);
  
    toast.promise(deleteBlockedIP(ip), {
      loading: `Unblocking IP ${ip}..`,
      success: () => {
        fetchData(['blockedips'])
          .then(() => setLoading(false));

        return 'IP unblocked successfully.';
      },
      error: () => {
        setLoading(false);
        return `Failed to unblock IP ${ip}.`;
      }
    });
  }

  return (
    <div className="flex flex-col my-8 mr-6 gap-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            Blocked IPs
            <span className="text-base font-normal text-tertiary">
              {data?.blockedIps?.length || 0}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            Here you can see the all the IPs that have been blocked by the system.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-y-2">
        {data?.blockedIps?.length === 0 ? (
          <div className='flex flex-col mt-16 gap-y-2'>
            <ErrorState 
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here...
                </div>
              } 
              message='There are no blocked IPs yet.'
            />
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <table className='w-full table-auto'>
              <thead className='text-left select-none bg-secondary'>
                <tr>
                  <th scope='col' className='px-6 py-4 font-semibold'>ID</th>
                  <th scope='col' className='px-6 py-4 font-semibold'>IP Adress</th>
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
                {displayedData?.map(blockedIp => (
                  <tr key={blockedIp.ip} className='text-sm text-secondary'>
                    <td className='px-6 py-4'>
                      {blockedIp._id}
                    </td>

                    <td className='px-6 py-4'>
                      {blockedIp.ip}
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(blockedIp.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </td>

                    <td className='px-6 py-4'>
                      <Countdown
                        date={new Date(new Date(blockedIp.createdAt).getTime() + 1000 * 21600 )}
                        renderer={({ days, hours, minutes, seconds, completed }) => {
                          if (completed) return 'Expired';

                          return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                        }}
                      />
                    </td>

                    <td className='px-6 py-4'>
                      <button
                        className={cn(
                          'flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1',
                          loading && 'pointer-events-none opacity-70'
                        )}
                        onClick={() => continueDeleteBlockedIP(blockedIp.ip)}
                      >
                        Delete <LuTrash2 />
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