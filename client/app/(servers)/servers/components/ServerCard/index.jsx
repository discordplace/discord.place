'use client';

import { TiStar, TbSquareRoundedChevronUp, MdUpdate, IoHeart, ImTrophy, HiSortAscending, HiSortDescending, GiInfinity, FaUsers, BsFire } from '@/icons';
import Link from 'next/link';import useSearchStore from '@/stores/servers/search';import { useMedia } from 'react-use';
import cn from '@/lib/cn';
import getRelativeTime from '@/lib/getRelativeTime';import config from '@/config';import useLanguageStore, { t } from '@/stores/language';
import ServerBanner from '@/app/components/ImageFromHash/ServerBanner';
import ServerIcon from '@/app/components/ImageFromHash/ServerIcon';
import Tooltip from '@/app/components/Tooltip';

export default function ServerCard(props) {
  const isMobile = useMedia('(max-width: 420px)', false);
  const language = useLanguageStore(state => state.language);
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
      transform: date => date ? getRelativeTime(date, language) : t('serverCard.neverVoted')
    },
    {
      icon: HiSortAscending,
      value: props.server.joined_at,
      condition: sort === 'Newest',
      transform: date => new Date(date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      icon: HiSortDescending,
      value: props.server.joined_at,
      condition: sort === 'Oldest',
      transform: date => new Date(date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      icon: TiStar,
      value: props.server.data.boosts,
      condition: sort === 'Boosts'
    }
  ];

  return (
    <Link
      className='group relative z-[1] h-[250px] w-full cursor-pointer overflow-hidden rounded-3xl p-0.5'
      href={`/servers/${props.server.id}`}
    >
      {props.server.standed_out?.created_at ? (
        <div className='pointer-events-none absolute inset-0 z-20 size-full animate-rotate rounded-full bg-[conic-gradient(#22c55e_20deg,transparent_120deg)] transition-opacity group-hover:opacity-0' />
      ) : (
        props.server.premium === true && (
          <div className='pointer-events-none absolute inset-0 z-20 size-full animate-rotate rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)] transition-opacity group-hover:opacity-0' />
        )
      )}

      <div className='relative z-20 flex size-full rounded-3xl border-4 border-primary'>
        {props.server.banner ? (
          <ServerBanner
            id={props.server.id}
            hash={props.server.banner}
            className='absolute left-0 top-0 z-[1] h-[calc(100%_-_1px)] w-full rounded-[1.25rem] bg-quaternary'
            size={512}
            width={350}
            height={200}
          />
        ) : (
          <div className='absolute left-0 top-0 z-[1] h-[calc(100%_-_1px)] w-full rounded-[1.25rem] bg-quaternary' />
        )}

        <div className='relative top-[30px] z-10 h-[calc(100%_-_30px)] w-full rounded-b-[1.25rem] rounded-t-3xl bg-secondary transition-colors group-hover:bg-tertiary'>
          <div className='relative'>
            <ServerIcon
              id={props.server.id}
              hash={props.server.icon}
              size={64}
              width={64}
              height={64}
              className={cn(
                'absolute top-[-25px] left-4 border-[4px] border-[rgba(var(--bg-secondary))] group-hover:border-[rgba(var(--bg-tertiary))] transition-colors rounded-3xl',
                props.server.icon && 'bg-secondary group-hover:bg-tertiary'
              )}
            />

            {typeof props.index === 'number' && (
              props.server.standed_out?.created_at ? (
                <div
                  className={cn(
                    'flex items-center justify-center text-secondary text-sm absolute top-[20px] bg-green-500/10 text-green-500 backdrop-blur-lg font-bold rounded-full transition-colors w-[20px] h-[20px] left-[60px]'
                  )}
                >
                  <GiInfinity />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex items-center justify-center text-secondary text-sm absolute top-[20px] font-bold rounded-full transition-colors w-[20px] h-[20px] left-[60px]',
                    props.index === 0 ? 'bg-yellow-600/10 text-yellow-500 backdrop-blur-lg' : 'bg-secondary group-hover:bg-tertiary'
                  )}
                >
                  {props.index + 1}.
                </div>
              )
            )}
          </div>

          <div className='flex flex-col px-4 pt-12'>
            <div className='flex items-center gap-x-2'>
              <h3 className='truncate text-lg font-semibold'>
                {props.server.name}
              </h3>
            </div>
            <p
              className='mt-1 min-h-[40px] overflow-hidden text-sm text-tertiary'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {props.server.description || t('serverCard.noDescription')}
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
                {config.serverCategoriesIcons[props.server.category]}
                {t(`categories.${props.server.category}`)}
              </div>
              {props.server.is_most_voted ? (
                <Tooltip
                  content={t('serverCard.mostVotedBadge.tooltip')}
                >
                  <div className='relative z-[1] overflow-hidden rounded-full p-[0.1rem]'>
                    <div className='pointer-events-none absolute inset-0 z-10 size-full animate-rotate rounded-full bg-[conic-gradient(#3b82f6_10deg,transparent_90deg)]'></div>

                    <div className='relative z-20 flex items-center gap-x-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-blue-500/50'>
                      <ImTrophy />

                      <span className='truncate'>
                        {t('serverCard.mostVotedBadge.label')}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              ) : props.server.vote_triple_enabled?.created_at && (
                <div className='relative z-[1] overflow-hidden rounded-full p-[0.1rem]'>
                  <div className='pointer-events-none absolute inset-0 z-10 size-full animate-rotate rounded-full bg-[conic-gradient(#f97316_10deg,transparent_90deg)]'></div>

                  <div className='relative z-20 flex items-center gap-x-1 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md'>
                    <BsFire /> {t('serverCard.tripledVoteBadge')}
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