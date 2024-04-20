import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import useSearchStore from '@/stores/servers/search';
import { MdKeyboardVoice } from 'react-icons/md';
import { HiOutlineStatusOnline, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import { IoHeart } from 'react-icons/io5';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import Image from 'next/image';
import { useMedia } from 'react-use';
import cn from '@/lib/cn';

export default function ServerCard(props) {
  const isMobile = useMedia('(max-width: 420px)', false);
  const storedSort = useSearchStore(state => state.sort);
  const sort = props.overridedSort || storedSort;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact'
  });

  const infos = [
    {
      icon: IoHeart,
      value: null,
      condition: props.server.premium === true && !isMobile,
      transform: () => 'Premium'
    },
    {
      icon: FaUsers,
      value: props.server.data.members,
      condition: true
    },
    {
      icon: TbSquareRoundedChevronUp,
      value: props.server.data.votes,
      condition: sort === 'Votes'
    },
    {
      icon: MdKeyboardVoice,
      value: props.server.data.voice,
      condition: sort === 'Voice'
    },
    {
      icon: HiOutlineStatusOnline,
      value: props.server.data.online,
      condition: sort === 'Online'
    },
    {
      icon: HiSortAscending,
      value: props.server.joined_at,
      condition: sort === 'Newest',
      transform: date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      icon: HiSortDescending,
      value: props.server.joined_at,
      condition: sort === 'Oldest',
      transform: date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      icon: TiStar,
      value: props.server.data.boosts,
      condition: sort === 'Boosts'
    }
  ];

  return (
    <Link 
      className='w-full h-[240px] relative overflow-y-clip group cursor-pointer border border-primary rounded-3xl' 
      href={`/servers/${props.server.id}`}
    >
      {props.server.banner_url ? (
        <Image
          className='absolute top-0 left-0 z-[1] w-full h-[calc(100%_-_1px)] rounded-3xl'
          src={props.server.banner_url}
          alt={`${props.server.name}'s banner`}
          width={350}
          height={200}
        />
      ) : (
        <div className='absolute top-0 left-0 z-[1] bg-quaternary w-full h-[calc(100%_-_1px)] rounded-3xl' />
      )}
      <div className='bg-secondary group-hover:bg-tertiary transition-colors w-full h-[calc(100%_-_30px)] z-[2] relative top-[30px] rounded-b-3xl rounded-t-[1.5rem]'>
        <div className='relative'>
          <ServerIcon
            icon_url={props.server.icon_url}
            name={props.server.name}
            width={64}
            height={64}
            className='absolute top-[-25px] left-4 bg-secondary group-hover:bg-tertiary border-[4px] border-[rgba(var(--bg-secondary))] group-hover:border-[rgba(var(--bg-tertiary))] transition-colors rounded-3xl'
          />

          <div className={cn(
            'flex items-center justify-center text-secondary text-sm absolute top-[20px] font-bold rounded-full transition-colors w-[20px] h-[20px] left-[60px]',
            props.index === 0 ? 'bg-yellow-600/10 text-yellow-500 backdrop-blur-lg' : 'bg-secondary group-hover:bg-tertiary'
          )}>
            {props.index + 1}.
          </div>
        </div>

        <div className='flex flex-col px-4 pt-12'>
          <div className='flex items-center gap-x-2'>
            <h3 className='text-lg font-semibold truncate'>
              {props.server.name}
            </h3>

            {props.server.premium && (
              <Image
                src='/profile-badges/premium.svg'
                alt='Premium badge'
                width={20}
                height={20}
                className='w-[14px] h-[14px]'
              />
            )}
          </div>
          <p 
            className='mt-1 overflow-hidden text-sm text-tertiary min-h-[40px]' 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.server.description || 'This server does not have a description. We can only imagine how beautiful it is inside.'}
          </p>

          <div className='flex items-center mt-3 gap-x-3'>
            {infos.filter(info => info.condition === true).map(info => (
              <div key={info.icon} className='flex gap-x-1.5 items-center text-sm'>
                <info.icon className='text-tertiary' />
                <span className='text-secondary'>{info.transform ? info.transform(info.value) : formatter.format(info.value)}</span>
              </div>
            ))}
          </div>

          <div className='flex items-center px-2.5 py-1 mt-3 text-sm font-medium rounded-full gap-x-1 w-max text-secondary bg-quaternary'>
            <BiSolidCategory />
            {props.server.category}
          </div>
        </div>
      </div>
    </Link>
  );
}