import MotionImage from '@/app/components/Motion/Image';
import Link from 'next/link';
import { HiDocumentDownload } from 'react-icons/hi';
import config from '@/config';

export default function EmojiCard({ id, name, animated, categories, downloads }) {
  return (
    <div className='flex flex-col w-full min-w-[155px]'>
      <Link 
        className='group relative flex items-center justify-center h-[110px] rounded-t-2xl bg-secondary lg:hover:bg-quaternary transition-colors group overflow-clip' 
        href={`/emojis/${id}`}
      >
        <MotionImage 
          src={config.getEmojiURL(id, animated)}
          alt={`${name} emoji`} 
          className='transition-all ease-in-out group-hover:w-[86px] w-[50px] group-hover:h-[86px] h-[50px]'
          width={128}
          height={128}
        />

        {animated && (
          <div className='absolute px-2 text-xs font-semibold uppercase bg-quaternary rounded-full right-2 top-1.5'>
            GIF
          </div>
        )}
      </Link>

      <div className='flex flex-col px-2 py-2 border-t-2 bg-tertiary rounded-b-2xl border-t-primary'>
        <div className='flex justify-between'>
          <h3 className='text-sm font-semibold text-primary max-w-[75%] truncate'>{name}</h3>
          <div className='flex items-center text-sm gap-x-0.5 text-tertiary font-medium'>
            <HiDocumentDownload />
            {downloads}
          </div>
        </div>

        <p className='text-xs font-medium text-tertiary max-w-[100%] truncate'>{categories.join(', ')}</p>
      </div>
    </div>
  );
}