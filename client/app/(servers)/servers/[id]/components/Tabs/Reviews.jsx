'use client';

import Pagination from '@/app/components/Pagination';
import useAuthStore from '@/stores/auth';
import { Suspense, useEffect, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { toast } from 'sonner';
import createReview from '@/lib/request/servers/createReview';
import LoginButton from '@/app/(servers)/servers/[id]/components/Tabs/LoginButton';
import { RiErrorWarningFill } from 'react-icons/ri';
import cn from '@/lib/cn';
import Link from 'next/link';
import config from '@/config';
import useLanguageStore, { t } from '@/stores/language';
import UserAvatar from '@/app/components/ImageFromHash/UserAvatar';

export default function Reviews({ server }) {
  const [page, setPage] = useState(1);
  const limit = 6;
  const maxPages = server.reviews.length / limit;
  const [reviews, setReviews] = useState(server.reviews.slice(0, limit));
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const user = useAuthStore(state => state.user);
  const loggedIn = useAuthStore(state => state.loggedIn);
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setReviews(server.reviews.slice(start, end));
        
    // eslint-disable-next-line
  }, [page]);

  const calcRating = (rating) => {
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
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }
  
  return (
    <div className="flex flex-col lg:w-[70%] px-8 lg:px-0">
      <h1 className="text-xl font-semibold">
        {t('serverPage.tabs.reviews.title')}
      </h1>
      
      <div className="flex flex-col w-full mt-8 gap-y-4 sm:flex-row">
        <div className="flex-col gap-y-4 flex w-[35%]">
          <h2 className="text-5xl font-bold sm:text-7xl">
            {((server.reviews.reduce((acc, review) => acc + review.rating, 0) / server.reviews.length) || 0).toFixed(1)}
          </h2>

          <div className="flex text-lg text-yellow-500 gap-x-0.5 sm:gap-x-2">
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
        
        <div className="flex flex-1 w-full">
          <div className='flex flex-col w-full gap-y-2'>
            {new Array(5).fill(null).map((_, index) => (
              <div key={index} className='flex items-center w-full gap-x-4'>
                <span className='font-semibold'>{5 - index}</span>
                
                <div className='flex w-full h-[5px] rounded-lg bg-tertiary'>
                  <div className='bg-yellow-500 rounded-lg' style={{ width: calcRating(5 - index) }} />
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
        <div className='flex flex-col p-4 mt-4 border border-blue-500 rounded-lg gap-y-2 bg-blue-500/10'>
          <h3 className='flex items-center text-lg font-semibold gap-x-2'>
            <RiErrorWarningFill />
            {t('serverPage.tabs.reviews.reviewSubmitted.info.title')}
          </h3>
          
          <span className='text-xs font-medium sm:text-sm text-tertiary'>
            {t('serverPage.tabs.reviews.reviewSubmitted.info.description')}
          </span>
        </div>
      )}

      <div className="flex flex-col w-full mt-8 gap-y-8 sm:gap-y-0 sm:flex-row">
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
            <div className="flex gap-x-4 w-[35%]">
              <UserAvatar
                id={user?.id}
                hash={user?.avatar}
                size={256}
                width={48}
                height={48}
                className='rounded-2xl w-[48px] h-[48px]'
              />

              <div className='flex flex-col gap-y-1'>
                <h3 className='text-base font-semibold'>
                  {user?.username || 'Unknown'}
                </h3>
                
                <div className={cn(
                  'flex items-center text-lg text-tertiary',
                  loading || reviewSubmitted ? 'pointer-events-none' : 'cursor-pointer'
                )}>
                  {[...Array(5)].map((_, index) => (
                    hoveredRating >= index + 1 || (selectedRating >= index + 1) ? (
                      <TiStarFullOutline
                        key={index} 
                        className='text-yellow-500 cursor-pointer'
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
              
            <div className="flex flex-col flex-1 w-full font-medium whitespace-pre-wrap gap-y-1 text-secondary">
              <h3 className='font-medium text-primary'>
                {t('serverPage.tabs.reviews.input.label')}
              </h3>
              
              <p className='text-xs sm:text-sm text-tertiary'>
                {loggedIn ? t('serverPage.tabs.reviews.input.description') : t('serverPage.tabs.reviews.loginRequiredForReview')}
              </p>
              
              <div className='relative'>
                <textarea
                  disabled={loading || reviewSubmitted || !loggedIn}
                  className='peer text-sm scrollbar-hide sm:text-base resize-none block w-full lg:max-w-[450px] min-h-[100px] max-h-[200px] p-2 mt-4 border-2 disabled:pointer-events-none disabled:opacity-80 [&:not(:disabled)]:cursor-text border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500'
                  value={review}
                  onChange={event => setReview(event.target.value)}
                  maxLength={config.reviewsMaxCharacters}
                />

                <span className={cn(
                  'absolute text-xs transition-opacity opacity-0 peer-focus-visible:opacity-100 -top-2 right-2 text-tertiary',
                  review.length > 0 && review.length < config.reviewsMinCharacters && 'text-red-400'
                )}>
                  {review.length}/{config.reviewsMaxCharacters}
                </span>
              </div>

              {loggedIn ? (
                <button
                  onClick={submitReview}
                  className='flex gap-x-1.5 items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70'
                  disabled={selectedRating === 0 || loading || reviewSubmitted || review.length < config.reviewsMinCharacters}
                >
                  {loading && <TbLoader className='animate-spin' />}
                  
                  {t('buttons.submitReview')} {selectedRating !== 0 && `(${selectedRating}/5)`}
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

      {reviews.map(review => (
        <div className="flex flex-col w-full mt-8 sm:flex-row gap-y-4" key={review._id}>
          <div className="flex gap-x-4 w-full sm:w-[35%]">
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
                className='rounded-2xl w-[48px] h-[48px]'
              />
            </Link>

            <div className='flex flex-col gap-y-1'>
              <Link 
                href={`/profile/u/${review.user.id}`}
                className='flex items-center text-base font-semibold transition-opacity hover:opacity-70'
              >
                <span className='max-w-[100px] mobile:max-w-[150px] sm:max-w-[100px] lg:max-w-[160px] truncate'>
                  {review.user.username}
                </span>
              </Link>

              <div className='flex items-center text-sm font-semibold text-tertiary'>
                <span className='text-xl text-primary'>{review.rating}</span>/5 <TiStarFullOutline className='ml-2 text-yellow-500' />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between flex-1 w-full font-medium max-w-[500px] break-words whitespace-pre-wrap sm:gap-y-0 gap-y-2 text-secondary">
            <span className='text-xs font-medium text-tertiary'>
              {new Date(review.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
            </span>
            
            {review.content}
          </div>
        </div>
      ))}

      {maxPages > 1 && (
        <div className='flex items-center justify-center w-full'>
          <Pagination 
            page={page} 
            setPage={setPage} 
            loading={loading} 
            total={server.reviews.length} 
            limit={limit} 
          />
        </div>
      )}
    </div>
  );
}