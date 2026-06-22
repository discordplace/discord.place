'use client';

import { BsFire } from 'react-icons/bs';
import { FaCompass } from 'react-icons/fa';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { ImTrophy } from 'react-icons/im';
import { IoHeart } from 'react-icons/io5';
import { MdUpdate } from 'react-icons/md';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import { TiStar } from 'react-icons/ti';
import Link from 'next/link';
import useSearchStore from '@/stores/bots/search';
import { useTranslation } from 'react-i18next';
import getRelativeTime from '@/lib/getRelativeTime';
import config from '@/config';
import { useMedia } from 'react-use';
import UserBanner from '@/app/components/ImageFromHash/UserBanner';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import Tooltip from '@/app/components/Tooltip';

export default function Card({ data, overridedSort }) {
  const { t, i18n } = useTranslation();
  const isMobile = useMedia('(max-width: 420px)', false);
  const storedSort = useSearchStore(state => state.sort);
  const sort = overridedSort || storedSort;
  const category = useSearchStore(state => state.category);

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    style: 'decimal'
  });

  const infos = [
    {
      condition: data.owner.premium === true && !isMobile,
      icon: IoHeart,
      transform: () => 'Premium',
      value: null
    },
    {
      condition: sort === 'Votes',
      icon: TbSquareRoundedChevronUp,
      value: data.votes
    },
    {
      condition: sort === 'LatestVoted',
      icon: MdUpdate,
      transform: date => (date ? getRelativeTime(date, i18n.language) : t('botCard.neverVoted')),
      value: data.latest_voted_at
    },
    {
      condition: sort === 'Servers',
      icon: FaCompass,
      transform: value => {
        const serversFormatter = new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
          notation: 'compact',
          style: 'decimal'
        });

        return serversFormatter.format(value);
      },
      value: data.servers
    },
    {
      condition: sort === 'Most Reviewed',
      icon: TiStar,
      transform: value => `${formatter.format(value)} Time Reviewed`,
      value: data.reviews
    },
    {
      condition: sort === 'Newest',
      icon: HiSortAscending,
      transform: date => new Date(date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
      value: data.created_at
    },
    {
      condition: sort === 'Oldest',
      icon: HiSortDescending,
      transform: date => new Date(date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
      value: data.created_at
    }
  ];

  return (
    <Link
      className='group relative z-1 flex h-[250px] w-full cursor-pointer overflow-hidden rounded-3xl p-0.5'
      href={`/bots/${data.id}`}
    >
      {data.standed_out?.created_at ? (
        <div className='pointer-events-none absolute inset-0 z-20 size-full animate-rotate rounded-full bg-[conic-gradient(#22c55e_20deg,transparent_120deg)] transition-opacity group-hover:opacity-0' />
      ) : (
        data.owner.premium === true && (
          <div className='pointer-events-none absolute inset-0 z-20 size-full animate-rotate rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)] transition-opacity group-hover:opacity-0' />
        )
      )}

      <div className='relative z-20 flex size-full rounded-3xl border-4 border-primary'>
        {data.banner ? (
          <UserBanner
            id={data.id}
            hash={data.banner}
            className='absolute top-0 left-0 z-1 h-[calc(100%-1px)] w-full rounded-[1.25rem] bg-quaternary'
            size={512}
            width={350}
            height={200}
          />
        ) : (
          <div className='absolute top-0 left-0 z-1 h-[calc(100%-1px)] w-full rounded-[1.25rem] bg-quaternary' />
        )}
        <div className='relative top-[30px] z-2 h-[calc(100%-30px)] w-full rounded-t-3xl rounded-b-[1.25rem] bg-secondary transition-colors group-hover:bg-tertiary'>
          <UserAvatar
            id={data.id}
            hash={data.avatar}
            size={64}
            width={64}
            height={64}
            className='absolute top-[-25px] left-4 rounded-3xl border-4 border-[rgba(var(--bg-secondary))] bg-secondary transition-colors group-hover:border-[rgba(var(--bg-tertiary))] group-hover:bg-tertiary'
          />

          <div className='flex flex-col px-4 pt-12'>
            <div className='flex items-center'>
              <span className='truncate text-lg font-semibold'>
                {data.username}
              </span>

              <span className='ml-0.5 text-xs text-tertiary'>
                #{data.discriminator}
              </span>
            </div>
            <p
              className='mt-1 min-h-[40px] overflow-hidden text-sm text-tertiary'
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '2'
              }}
            >
              {data.short_description || t('botCard.noDescription')}
            </p>

            <div className='mt-3 flex items-center gap-x-3'>
              {infos.filter(info => info.condition === true).map(info => (
                <div key={info.icon} className='flex items-center gap-x-1.5 text-sm'>
                  <info.icon className='text-tertiary' />
                  <span className='max-w-[115px] truncate text-secondary'>{info.transform ? info.transform(info.value) : formatter.format(info.value)}</span>
                </div>
              ))}
            </div>

            <div className='mt-3 flex items-center gap-x-2'>
              <div className='flex w-max items-center gap-x-1 rounded-full bg-quaternary px-2.5 py-1 text-sm font-medium text-secondary'>
                {config.botCategoriesIcons[data.categories[0]]}
                {t(`categories.${category === 'All' ? data.categories[0] : category}`)}
              </div>

              {data.is_most_voted ? (
                <Tooltip
                  content={t('botCard.mostVotedBadge.tooltip')}
                >
                  <div className='relative z-1 overflow-hidden rounded-full p-[0.1rem]'>
                    <div className='pointer-events-none absolute inset-0 z-10 size-full animate-rotate rounded-full bg-[conic-gradient(#3b82f6_10deg,transparent_90deg)]'></div>

                    <div className='relative z-20 flex items-center gap-x-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-blue-500/50'>
                      <ImTrophy />

                      <span className='truncate'>
                        {t('botCard.mostVotedBadge.label')}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              ) : (
                data.vote_triple_enabled?.created_at && (
                  <div className='relative z-1 overflow-hidden rounded-full p-[0.1rem]'>
                    <div className='pointer-events-none absolute inset-0 z-10 size-full animate-rotate rounded-full bg-[conic-gradient(#f97316_10deg,transparent_90deg)]'></div>

                    <div className='relative z-20 flex items-center gap-x-1 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md'>
                      <BsFire /> {t('botCard.tripledVoteBadge')}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}