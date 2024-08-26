'use client';

import Link from 'next/link';
import { FaCompass } from 'react-icons/fa';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import useSearchStore from '@/stores/bots/search';
import { TiStar } from 'react-icons/ti';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { MdUpdate } from 'react-icons/md';
import { IoHeart } from 'react-icons/io5';
import { useMedia } from 'react-use';
import getRelativeTime from '@/lib/getRelativeTime';
import { BsFire } from 'react-icons/bs';
import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function Card({ data, overridedSort }) {
  const isMobile = useMedia('(max-width: 420px)', false);
  const language = useLanguageStore(state => state.language);
  const storedSort = useSearchStore(state => state.sort);
  const sort = overridedSort || storedSort;
  const category = useSearchStore(state => state.category);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact'
  });

  const infos = [
    {
      icon: IoHeart,
      value: null,
      condition: data.owner.premium === true && !isMobile,
      transform: () => 'Premium'
    },
    {
      icon: TbSquareRoundedChevronUp,
      value: data.votes,
      condition: sort === 'Votes'
    },
    {
      icon: MdUpdate,
      value: data.latest_voted_at,
      condition: sort === 'LatestVoted',
      transform: date => date ? getRelativeTime(date, language) : t('botCard.neverVoted')
    },
    {
      icon: FaCompass,
      value: data.servers,
      condition: sort === 'Servers',
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
      icon: TiStar,
      value: data.reviews,
      condition: sort === 'Most Reviewed',
      transform: value => `${formatter.format(value)} Time Reviewed`
    },
    {
      icon: HiSortAscending,
      value: data.created_at,
      condition: sort === 'Newest',
      transform: date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      icon: HiSortDescending,
      value: data.created_at,
      condition: sort === 'Oldest',
      transform: date => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  ];

  return (
    <Link 
      className='w-full p-0.5 h-[250px] relative z-[1] overflow-hidden group cursor-pointer rounded-3xl'
      href={`/bots/${data.id}`}
    >
      {data.standed_out?.created_at ? (
        <div className="group-hover:opacity-0 transition-[opacity] animate-rotate absolute inset-0 z-[20] h-full w-full rounded-full bg-[conic-gradient(#22c55e_20deg,transparent_120deg)] pointer-events-none" />
      ) : (
        data.owner.premium === true && (
          <div className="group-hover:opacity-0 transition-[opacity] animate-rotate absolute inset-0 z-[20] h-full w-full rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)] pointer-events-none" />
        )
      )}

      <div className='flex w-full h-full z-[20] relative border-4 border-primary rounded-3xl'>
        {data.banner ? (
          <UserBanner
            id={data.id}
            hash={data.banner}
            className='bg-quaternary absolute top-0 left-0 z-[1] w-full h-[calc(100%_-_1px)] rounded-[1.25rem]'
            size={512}
            width={350}
            height={200}
          />
        ) : (
          <div className='absolute top-0 left-0 z-[1] bg-quaternary w-full h-[calc(100%_-_1px)] rounded-[1.25rem]' />
        )}
        <div className='bg-secondary group-hover:bg-tertiary transition-colors w-full h-[calc(100%_-_30px)] z-[2] relative top-[30px] rounded-b-[1.25rem] rounded-t-[1.5rem]'>
          <UserAvatar
            id={data.id}
            hash={data.avatar}
            size={64}
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
            </div>
            <p 
              className='mt-1 overflow-hidden text-sm text-tertiary min-h-[40px]' 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {data.short_description || t('botCard.noDescription')}
            </p>

            <div className='flex items-center mt-3 gap-x-3'>
              {infos.filter(info => info.condition === true).map(info => (
                <div key={info.icon} className='flex gap-x-1.5 items-center text-sm'>
                  <info.icon className='text-tertiary' />
                  <span className='truncate max-w-[115px] text-secondary'>{info.transform ? info.transform(info.value) : formatter.format(info.value)}</span>
                </div>
              ))}
            </div>

            <div className='flex items-center mt-3 gap-x-2'>
              <div className='flex items-center px-2.5 py-1 text-sm font-medium rounded-full gap-x-1 w-max text-secondary bg-quaternary'>
                {config.botCategoriesIcons[data.categories[0]]}
                {t(`categories.${category === 'All' ? data.categories[0] : category}`)}
              </div>

              {data.vote_triple_enabled?.created_at && (
                <div className='relative z-[1] p-[0.1rem] overflow-hidden rounded-full'>
                  <div className="animate-rotate absolute inset-0 z-[10] h-full w-full rounded-full bg-[conic-gradient(#f97316_10deg,transparent_90deg)] pointer-events-none"></div>

                  <div className='flex z-[20] relative items-center px-3 py-1 text-xs font-bold text-white rounded-full gap-x-1 bg-orange-500/20 backdrop-blur-md'>
                    <BsFire /> {t('botCard.tripledVoteBadge')}
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
