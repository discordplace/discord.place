import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { TbExternalLink } from 'react-icons/tb';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { LuTrash2 } from 'react-icons/lu';
import useModalsStore from '@/stores/modals';
import { useShallow } from 'zustand/react/shallow';
import deleteTemplate from '@/lib/request/templates/deleteTemplate';
import useDashboardStore from '@/stores/dashboard';
import { toast } from 'sonner';

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

  function continueDeleteTemplate(id) {
    disableButton('delete-template', 'confirm');

    toast.promise(deleteTemplate(id), {
      loading: 'Deleting template..',
      success: () => {
        closeModal('delete-template');
        fetchData(['templates']);

        return 'Template deleted successfully!';
      },
      error: error => {
        enableButton('delete-template', 'confirm');

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
            message='There are no templates that have been approved yet.'
          />
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Name</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Description</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Categories</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Date</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[rgba(var(--bg-quaternary))]'>
              {displayedData?.map(template => (
                <tr key={template.id} className='text-sm text-secondary'>
                  <td className='px-6 py-4'>
                    {template.user?.username ? (
                      <Link 
                        className='flex items-center transition-opacity gap-x-4 hover:opacity-70'
                        href={`/profile/u/${template.user.id}`}
                      >
                        <Image
                          src={template.user.avatar_url}
                          alt={`${template.user.username}'s avatar`}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />

                        <div className='flex flex-col gap-y-1'>
                          <h2 className='text-base font-semibold'>{template.user.username}</h2>
                          <span className='text-xs font-medium text-tertiary'>{template.user.id}</span>
                        </div>
                      </Link>
                    ) : template.user.id}
                  </td>

                  <td className='px-6 py-4'>
                    {template.name}
                  </td>

                  <td className='px-6 py-4'>
                    <p className='max-w-[500px] text-sm font-medium'>
                      {template.description}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    {template.categories.join(', ')}
                  </td>

                  <td className='px-6 py-4'>
                    {new Date(template.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </td>
                  
                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <Link
                        href={`/templates/${template.id}/preview`}
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                      >
                        Preview
                        <TbExternalLink />
                      </Link>

                      <button
                        className='flex items-center px-4 py-1.5 text-sm font-semibold bg-quaternary rounded-lg hover:bg-tertiary text-primary w-max gap-x-1'
                        onClick={() => 
                          openModal('delete-template', {
                            title: 'Delete Template',
                            description: 'Are you sure you want to delete this template?',
                            content: (
                              <p className='text-sm text-tertiary'>
                                Please note that deleting this template will remove it from the queue and it will not be visible to anyone.
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
                                action: () => continueDeleteTemplate(template.id)
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