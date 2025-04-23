'use client';

import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline, TbLoader, RiErrorWarningFill } from '@/icons';
import Pagination from '@/app/components/Pagination';
import useAuthStore from '@/stores/auth';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import createReview from '@/lib/request/servers/createReview';
import fetchReviews from '@/lib/request/servers/fetchReviews';
import LoginButton from '@/app/(servers)/servers/[id]/components/Tabs/LoginButton';
import cn from '@/lib/cn';
import Link from 'next/link';
import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';
import ReportableArea from '@/app/components/ReportableArea';
import Image from 'next/image';

export default function Reviews({ server }) {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    setReviewsLoading(true);

    fetchReviews(server.id, page, limit)
      .then(data => {
        setReviews(data.reviews);
        setTotalReviews(data.total);
      })
      .catch(error => toast.error(error))
      .finally(() => setReviewsLoading(false));
  }, [server.id, page, limit]);

  const calcRating = rating => {
    const totalReviews = server.reviews.length;
    const ratingCount = server.reviews.filter(review => review.rating === rating).length;
    const percentage = (ratingCount / totalReviews) * 100;

    return `${percentage}%`;
  };

  function submitReview() {
    setLoading(true);

    toast.promise(createReview(server.id, { rating: selectedRating, content: review }), {
      loading: t('serverPage.tabs.reviews.toast.submittingReview'),
      success: () => {
        setLoading(false);
        setSelectedRating(0);
        setReview('');
        setReviewSubmitted(true);

        return t('serverPage.tabs.reviews.toast.reviewSubmitted');
      },
      error: () => setLoading(false)
    });
  }

  const showPagination = !reviewsLoading && totalReviews > limit;

  return (
    <div className='flex flex-col px-8 lg:w-[70%] lg:px-0'>
      <h1 className='text-xl font-semibold'>
        {t('serverPage.tabs.reviews.title')}
      </h1>

      <div className='mt-8 flex w-full flex-col gap-y-4 sm:flex-row'>
        <div className='flex w-[35%] flex-col gap-y-4'>
          <h2 className='text-5xl font-bold sm:text-7xl'>
            {((server.reviews.reduce((acc, review) => acc + review.rating, 0) / server.reviews.length) || 0).toFixed(1)}
          </h2>

          <div className='flex gap-x-0.5 text-lg text-yellow-500 sm:gap-x-2'>
            {[...Array(5)].map((_, index) => {
              const rating = server.reviews.reduce((acc, review) => acc + review.rating, 0) / server.reviews.length;
              if (rating >= index + 1) return <TiStarFullOutline key={index} />;
              if (rating >= index + 0.5) return <TiStarHalfOutline key={index} />;

              return <TiStarOutline key={index} className='text-tertiary' />;
            })}
          </div>

          <span className='text-sm text-tertiary'>
            {t('serverPage.tabs.reviews.totalReviews', { postProcess: 'interval', count: server.reviews.length })}
          </span>
        </div>

        <div className='flex w-full flex-1'>
          <div className='flex w-full flex-col gap-y-2'>
            {new Array(5).fill(null).map((_, index) => (
              <div key={index} className='flex w-full items-center gap-x-4'>
                <span className='font-semibold'>{5 - index}</span>

                <div className='flex h-[5px] w-full rounded-lg bg-tertiary'>
                  <div className='rounded-lg bg-yellow-500' style={{ width: calcRating(5 - index) }} />
                </div>

                <span className='text-sm font-medium text-tertiary'>
                  {server.reviews.filter(review => review.rating === 5 - index).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {reviewSubmitted && (
        <div className='mt-4 flex flex-col gap-y-2 rounded-lg border border-blue-500 bg-blue-500/10 p-4'>
          <h3 className='flex items-center gap-x-2 text-lg font-semibold'>
            <RiErrorWarningFill />
            {t('serverPage.tabs.reviews.reviewSubmitted.info.title')}
          </h3>

          <span className='text-xs font-medium text-tertiary sm:text-sm'>
            {t('serverPage.tabs.reviews.reviewSubmitted.info.description')}
          </span>
        </div>
      )}

      <div className='mt-8 flex w-full flex-col gap-y-8 sm:flex-row sm:gap-y-0'>
        {server.has_reviewed ? (
          <span className='text-sm font-medium text-tertiary'>
            {t('serverPage.tabs.reviews.reviewSubmitted.alreadyReviewed')}
          </span>
        ) : server.ownerId === user?.id ? (
          <span className='text-sm font-medium text-tertiary'>
            {t('serverPage.tabs.reviews.ownerCannotReview')}
          </span>
        ) : (
          <>
            <div className='flex w-[35%] flex-col gap-y-3'>
              <div className='flex gap-x-4'>
                {loggedIn ? (
                  <UserAvatar
                    id={user?.id}
                    hash={user?.avatar}
                    size={256}
                    width={48}
                    height={48}
                    className='size-[48px] rounded-2xl'
                  />
                ) : (
                  <Image
                    src='/default-discord-avatar.png'
                    alt='Placeholder Avatar'
                    width={48}
                    height={48}
                    className='size-[48px] rounded-2xl'
                  />
                )}

                <div className='flex flex-col gap-y-1'>
                  <h3 className='text-base font-semibold'>
                    {user?.username || 'Unknown'}
                  </h3>

                  <div
                    className={cn(
                      'flex items-center text-lg text-tertiary',
                      loading || reviewSubmitted ? 'pointer-events-none' : 'cursor-pointer'
                    )}
                  >
                    {[...Array(5)].map((_, index) => (
                      hoveredRating >= index + 1 || (selectedRating >= index + 1) ? (
                        <TiStarFullOutline
                          key={index}
                          className='cursor-pointer text-yellow-500'
                          onClick={() => {
                            if (selectedRating === index + 1) setSelectedRating(0);
                            else setSelectedRating(index + 1);
                          }}
                          onMouseEnter={() => setHoveredRating(index + 1)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      ) : (
                        <TiStarOutline
                          key={index}
                          className='cursor-pointer text-tertiary'
                          onClick={() => setSelectedRating(index + 1)}
                          onMouseEnter={() => setHoveredRating(index + 1)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      )
                    ))}
                  </div>
                </div>
              </div>

              {loggedIn && (
                <span
                  className={cn(
                    'text-xs font-medium text-tertiary select-none',
                    selectedRating === 0 && 'text-red-400'
                  )}
                >
                  {selectedRating === 0 ? (
                    t('serverPage.tabs.reviews.ratingRequired')
                  ) : (
                    t('serverPage.tabs.reviews.ratingSelected', { count: selectedRating })
                  )}
                </span>
              )}
            </div>

            <div className='flex w-full flex-1 flex-col gap-y-1 whitespace-pre-wrap font-medium text-secondary'>
              <h3 className='font-medium text-primary'>
                {t('serverPage.tabs.reviews.input.label')}
              </h3>

              <p className='text-xs text-tertiary sm:text-sm'>
                {loggedIn ? t('serverPage.tabs.reviews.input.description') : t('serverPage.tabs.reviews.loginRequiredForReview')}
              </p>

              <div className='relative'>
                <textarea
                  disabled={loading || reviewSubmitted || !loggedIn}
                  className='scrollbar-hide peer mt-4 block max-h-[200px] min-h-[100px] w-full resize-none rounded-lg border-2 border-transparent bg-secondary p-2 text-sm text-placeholder outline-none focus-visible:border-purple-500 focus-visible:text-primary disabled:pointer-events-none disabled:opacity-80 sm:text-base lg:max-w-[450px] [&:not(:disabled)]:cursor-text'
                  value={review}
                  onChange={event => setReview(event.target.value)}
                  maxLength={config.reviewsMaxCharacters}
                />

                <span
                  className={cn(
                    'absolute text-xs transition-opacity opacity-0 peer-focus-visible:opacity-100 -top-2 right-2 text-tertiary',
                    review.length > 0 && review.length < config.reviewsMinCharacters && 'text-red-400'
                  )}
                >
                  {review.length}/{config.reviewsMaxCharacters}
                </span>
              </div>

              {loggedIn ? (
                <button
                  onClick={submitReview}
                  className='mt-4 flex items-center justify-center gap-x-1.5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
                  disabled={selectedRating === 0 || loading || reviewSubmitted || review.length < config.reviewsMinCharacters || reviewsLoading}
                >
                  {loading && <TbLoader className='animate-spin' />}

                  {t('buttons.submitReview')}
                </button>
              ) : (
                <Suspense fallback={<></>}>
                  <LoginButton />
                </Suspense>
              )}
            </div>
          </>
        )}
      </div>

      {reviewsLoading ? (
        new Array(6).fill(null).map((_, index) => (
          <div
            className='mt-8 flex w-full flex-col gap-y-4 sm:flex-row'
            key={`review-loading-${index}`}
          >
            <div className='flex w-full gap-x-4 sm:w-[35%]'>
              <div className='size-[48px] min-h-[48px] min-w-[48px] animate-pulse rounded-2xl bg-quaternary'>
                &thinsp;
              </div>

              <div className='flex w-full flex-col gap-y-1'>
                <div className='flex w-full max-w-[100px] animate-pulse items-center rounded-xl bg-quaternary text-base mobile:max-w-[150px] sm:max-w-[100px] lg:max-w-[160px]'>
                  &thinsp;
                </div>

                <div className='flex items-center text-sm font-semibold text-tertiary'>
                  <span className='h-[15px] w-full max-w-[50px] animate-pulse rounded-xl bg-quaternary' />
                  <TiStarFullOutline className='ml-2 animate-pulse text-[rgba(var(--bg-quaternary))]' />
                </div>
              </div>
            </div>

            <div className='flex w-full max-w-[440px] flex-1 flex-col justify-between gap-y-2 whitespace-pre-wrap break-words font-medium text-secondary sm:gap-y-0'>
              <span className='h-[15px] w-full max-w-[150px] animate-pulse rounded-xl bg-quaternary text-xs font-medium text-tertiary'>
                &thinsp;
              </span>

              <div className='mt-2 flex w-full flex-col gap-y-2'>
                <span className='h-[20px] w-full max-w-full animate-pulse rounded-xl bg-quaternary text-xs font-medium text-tertiary'>
                  &thinsp;
                </span>
                <span className='h-[20px] w-full max-w-[65%] animate-pulse rounded-xl bg-quaternary text-xs font-medium text-tertiary'>
                  &thinsp;
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        reviews.map(review => (
          <div className='mt-8 flex w-full flex-col gap-y-4 sm:flex-row' key={review._id}>
            <div className='flex w-full gap-x-4 sm:w-[35%]'>
              <Link
                href={`/profile/u/${review.user.id}`}
                className='transition-opacity hover:opacity-70'
              >
                <UserAvatar
                  id={review.user.id}
                  hash={review.user.avatar}
                  size={64}
                  width={48}
                  height={48}
                  className='size-[48px] rounded-2xl'
                />
              </Link>

              <div className='flex flex-col gap-y-1'>
                <Link
                  href={`/profile/u/${review.user.id}`}
                  className='flex items-center text-base font-semibold transition-opacity hover:opacity-70'
                >
                  <span className='max-w-[100px] truncate mobile:max-w-[150px] sm:max-w-[100px] lg:max-w-[160px]'>
                    {review.user.username}
                  </span>
                </Link>

                <div className='flex items-center text-sm font-semibold text-tertiary'>
                  <span className='text-xl text-primary'>{review.rating}</span>/5 <TiStarFullOutline className='ml-2 text-yellow-500' />
                </div>
              </div>
            </div>

            <ReportableArea
              type='review'
              active={user?.id !== review.user.id}
              metadata={{
                reviewer: {
                  id: review.user.id,
                  username: review.user.username,
                  avatar: review.user.avatar
                },
                rating: review.rating,
                content: review.content
              }}
              identifier={`server-${server.id}-review-${review._id}`}
            >
              <div className='flex w-full max-w-[440px] flex-1 flex-col justify-between gap-y-2 whitespace-pre-wrap break-words font-medium text-secondary sm:gap-y-0'>
                <span className='text-xs font-medium text-tertiary'>
                  {new Date(review.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                </span>

                {review.content}
              </div>
            </ReportableArea>
          </div>
        ))
      )}

      {showPagination && (
        <div className='flex w-full items-center justify-center'>
          <Pagination
            page={page}
            setPage={setPage}
            loading={loading || reviewsLoading}
            total={totalReviews}
            limit={limit}
            disableAnimation={true}
          />
        </div>
      )}
    </div>
  );
}