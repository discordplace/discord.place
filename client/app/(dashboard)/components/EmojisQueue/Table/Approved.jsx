import { useState } from 'react';
import Pagination from '@/app/components/Pagination';
import Image from 'next/image';
import config from '@/config';
import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';
import Link from 'next/link';
import { TbExternalLink } from 'react-icons/tb';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';

export default function Approved({ data }) {
  const [page, setPage] = useState(1);
  const displayedData = data?.slice((page - 1) * 10, page * 10);

  const showPagination = data?.length > 10;

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
            message='There are no emojis that have been approved yet.'
          />
        </div>
      ) : (
        <div class="relative w-full overflow-x-auto">
          <table className='w-full table-auto'>
            <thead className='text-left select-none bg-secondary'>
              <tr>
                <th scope='col' className='px-6 py-4 font-semibold'>Name</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Image(s)</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Categories</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Publisher</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Downloads</th>
                <th scope='col' className='px-6 py-4 font-semibold'>Actions</th>
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
                      className='flex items-center transition-opacity gap-x-2 hover:opacity-70'
                      href={`/profile/u/${emoji.user.id}`}
                    >
                      <Image
                        src={emoji.user.avatar_url}
                        alt={`${emoji.user.username}'s avatar`}
                        width={24}
                        height={24}
                        className='rounded-full'
                      />

                      <span className='text-sm font-medium'>
                        {emoji.user.username}
                      </span>
                    </Link>
                  </td>

                  <td className='px-6 py-4'>
                    {emoji.downloads}
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex gap-x-2'>
                      <Link
                        href={`/emojis/${emoji.id}`}
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                      >
                        View
                        <TbExternalLink />
                      </Link>
                      
                      <button 
                        className='flex items-center px-4 py-1 text-sm font-semibold rounded-lg text-primary w-max gap-x-1 bg-quaternary hover:bg-tertiary'
                        onClick={() => downloadEmoji(emoji)}
                      >
                        Download
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