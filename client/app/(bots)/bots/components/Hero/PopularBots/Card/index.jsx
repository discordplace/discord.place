import Image from 'next/image';
import Link from 'next/link';
import { TbBoxMultiple, TbSquareRoundedChevronUp } from 'react-icons/tb';
import { IoHeart } from 'react-icons/io5';
import { useMedia } from 'react-use';
import { BiSolidCategory } from 'react-icons/bi';
import useSearchStore from '@/stores/bots/search';

export default function Card({ data }) {
  const category = useSearchStore(state => state.category);
  const isMobile = useMedia('(max-width: 420px)', false);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact'
  });

  const infos = [
    {
      icon: IoHeart,
      value: null,
      condition: data.owner?.premium === true && !isMobile,
      transform: () => 'Premium'
    },
    {
      icon: TbBoxMultiple,
      value: data.servers,
      condition: true,
      transform: value => {
        const serversFormatter = new Intl.NumberFormat('en-US', {
          style: 'decimal',
          notation: 'compact',
          maximumFractionDigits: 2
        });

        return serversFormatter.format(value);
      }
    },
    {
      icon: TbSquareRoundedChevronUp,
      value: data.votes,
      condition: true
    }
  ];

  return (
    <Link 
      className='w-full h-[240px] relative overflow-y-clip group cursor-pointer border border-primary rounded-3xl' 
      href={`/bots/${data.id}`}
    >
      {data.banner_url ? (
        <Image
          className='absolute top-0 left-0 z-[1] w-full h-[calc(100%_-_1px)] rounded-3xl'
          src={data.banner_url}
          alt={`${data.username}'s banner`}
          width={350}
          height={200}
        />
      ) : (
        <div className='absolute top-0 left-0 z-[1] bg-quaternary w-full h-[calc(100%_-_1px)] rounded-3xl' />
      )}
      <div className='bg-secondary group-hover:bg-tertiary transition-colors w-full h-[calc(100%_-_30px)] z-[2] relative top-[30px] rounded-b-3xl rounded-t-[1.5rem]'>
        <Image
          src={data.avatar_url}
          alt={`${data.username}'s avatar`}
          width={64}
          height={64}
          className='absolute top-[-25px] left-4 bg-secondary group-hover:bg-tertiary border-[4px] border-[rgba(var(--bg-secondary))] group-hover:border-[rgba(var(--bg-tertiary))] transition-colors rounded-3xl'
        />

        <div className='flex flex-col px-4 pt-12'>
          <div className='flex items-center'>
            <span className='text-lg font-semibold truncate'>
              {data.username}
            </span>
            <span className='ml-0.5 text-xs text-tertiary'>
              #{data.discriminator}
            </span>

            {data.owner?.premium && (
              <Image
                src='/profile-badges/premium.svg'
                alt='Premium badge'
                width={20}
                height={20}
                className='w-[14px] h-[14px] ml-2'
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
            {data.short_description || 'This bot does not have a description. We can only imagine how beautiful it is.'}
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
            {category || data.categories[0]}
          </div>
        </div>
      </div>
    </Link>
  );
}