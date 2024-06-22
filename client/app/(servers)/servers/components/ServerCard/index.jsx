import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import useSearchStore from '@/stores/servers/search';
import { MdKeyboardVoice, MdUpdate } from 'react-icons/md';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { TiStar } from 'react-icons/ti';
import { IoHeart } from 'react-icons/io5';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import Image from 'next/image';
import { useMedia } from 'react-use';
import cn from '@/lib/cn';
import getRelativeTime from '@/lib/getRelativeTime';
import { BsFire } from 'react-icons/bs';
import config from '@/config';

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
      icon: MdUpdate,
      value: props.server.data.latest_voted_at,
      condition: sort === 'LatestVoted',
      transform: getRelativeTime
    },
    {
      icon: MdKeyboardVoice,
      value: props.server.data.voice,
      condition: sort === 'Voice'
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
      className='w-full p-0.5 h-[250px] relative z-[1] overflow-hidden group cursor-pointer rounded-3xl'
      href={`/servers/${props.server.id}`}
    >
      {props.server.premium === true && (
        <div className="group-hover:opacity-0 transition-[opacity] animate-rotate absolute inset-0 z-[20] h-full w-full rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)] pointer-events-none"></div>
      )}

      <div className='flex w-full h-full z-[20] relative border-4 border-primary rounded-3xl'>
        {props.server.banner_url ? (
          <Image
            className='bg-quaternary absolute top-0 left-0 z-[1] w-full h-[calc(100%_-_1px)] rounded-[1.25rem]'
            src={props.server.banner_url}
            alt={`${props.server.name}'s banner`}
            width={350}
            height={200}
          />
        ) : (
          <div className='absolute top-0 left-0 z-[1] bg-quaternary w-full h-[calc(100%_-_1px)] rounded-[1.25rem]' />
        )}

        <div className='bg-secondary group-hover:bg-tertiary transition-colors w-full h-[calc(100%_-_30px)] z-[10] relative top-[30px] rounded-b-[1.25rem] rounded-t-[1.5rem]'>
          <div className='relative'>
            <ServerIcon
              icon_url={props.server.icon_url}
              name={props.server.name}
              width={64}
              height={64}
              className={cn(
                props.server.icon_url ? 'bg-secondary group-hover:bg-tertiary' : '[&>h2]:text-xl',
                'absolute top-[-25px] left-4 border-[4px] border-[rgba(var(--bg-secondary))] group-hover:border-[rgba(var(--bg-tertiary))] transition-colors rounded-3xl'
              )}
            />

            {typeof props.index === 'number' && (
              <div className={cn(
                'flex items-center justify-center text-secondary text-sm absolute top-[20px] font-bold rounded-full transition-colors w-[20px] h-[20px] left-[60px]',
                props.index === 0 ? 'bg-yellow-600/10 text-yellow-500 backdrop-blur-lg' : 'bg-secondary group-hover:bg-tertiary'
              )}>
                {props.index + 1}.
              </div>
            )}
          </div>

          <div className='flex flex-col px-4 pt-12'>
            <div className='flex items-center gap-x-2'>
              <h3 className='text-lg font-semibold truncate'>
                {props.server.name}
              </h3>
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

            <div className='flex items-center mt-3 gap-x-2'>
              <div className='flex items-center px-2.5 py-1 text-sm font-medium rounded-full gap-x-1 w-max text-secondary bg-quaternary'>
                {config.serverCategoriesIcons[props.server.category]}
                {props.server.category}
              </div>

              {props.server.vote_triple_enabled?.created_at && (
                <div className='relative z-[1] p-[0.1rem] overflow-hidden rounded-full'>
                  <div className="animate-rotate absolute inset-0 z-[10] h-full w-full rounded-full bg-[conic-gradient(#f97316_10deg,transparent_90deg)] pointer-events-none"></div>

                  <div className='flex z-[20] relative items-center px-3 py-1 text-xs font-bold text-white rounded-full gap-x-1 bg-orange-500/20 backdrop-blur-md'>
                    <BsFire /> 3X VOTE!
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </Link>
  );
}