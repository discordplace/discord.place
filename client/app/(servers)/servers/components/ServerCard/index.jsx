import Image from 'next/image';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import cn from '@/lib/cn';
import useSearchStore from '@/stores/servers/search';
import { MdKeyboardVoice } from 'react-icons/md';
import { HiOutlineStatusOnline, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import { IoHeart } from 'react-icons/io5';

export default function ServerCard({ server, index }) {
  const sort = useSearchStore(state => state.sort);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact'
  });

  return (
    <Link
      className={cn(
        'relative h-[80px] overflow-clip w-full rounded-xl flex items-center bg-secondary hover:bg-quaternary',
        index === 0 && 'border-2 border-yellow-500 bg-gradient-to-r from-yellow-500/20',
        index === 1 && 'border-2 border-gray-500 bg-gradient-to-r from-gray-500/20'
      )} 
      key={index}
      href={`/servers/${server.id}`}
    >
      <Image
        src={server.icon_url} 
        alt={server.name}
        width={50}
        height={50}
        className='ml-4 rounded-xl z-[3] w-[32px] h-[32px] mobile:w-[50px] mobile:h-[50px]'
      />

      <div className='flex flex-1 w-full h-full mx-4 z-[3] justify-between'>
        <div className='flex flex-col justify-center'>
          <h1 className='text-base max-w-[130px] mobile:max-w-[200px] sm:max-w-[400px] lg:max-w-[500px] font-bold truncate mobile:text-xl text-primary'>
            {server.name}
          </h1>
          <div className='flex gap-x-2 sm:gap-x-4'>
            <span className='flex items-center text-xs font-medium mobile:text-sm text-tertiary gap-x-2'>
              {formatter.format(server.data.members)} <FaUsers />
            </span>
                
            <span className='flex items-center text-xs font-medium mobile:text-sm text-tertiary gap-x-2'>
              {server.category} <BiSolidCategory />
            </span>

            {server.premium && (
              <span className='flex items-center text-xs font-medium mobile:text-sm text-tertiary gap-x-2'>
                Premium <IoHeart />
              </span>
            )}
          </div>
        </div>

        <div className='flex items-center'>
          <div className='h-[40px] text-primary text-sm mobile:text-xl gap-x-2 font-bold items-center flex justify-center'>
            {sort === 'Votes' && (
              <>
                {server.data.votes}
                <TbSquareRoundedChevronUp />
              </>
            )}

            {sort === 'Voice' && (
              <>
                {server.data.voice}
                <MdKeyboardVoice />
              </>
            )}

            {sort === 'Members' && (
              <>
                {server.data.members}
                <FaUsers />
              </>
            )}

            {sort === 'Online' && (
              <>
                {server.data.online}
                <HiOutlineStatusOnline />
              </>
            )}

            {sort === 'Newest' && (
              <>
                {new Date(server.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <HiSortAscending />
              </>
            )}

            {sort === 'Oldest' && (
              <>
                {new Date(server.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                <HiSortDescending />
              </>
            )}

            {sort === 'Boosts' && (
              <>
                {server.data.boosts}
                <TiStar />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}