import Pagination from '@/app/components/Pagination';
import useAuthStore from '@/stores/auth';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';
import { toast } from 'sonner';
import createReview from '@/lib/request/servers/createReview';
import LoginButton from '@/app/(servers)/servers/[id]/components/Tabs/LoginButton';
import { RiErrorWarningFill } from 'react-icons/ri';
import cn from '@/lib/cn';

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
      loading: 'Submitting your review..',
      success: () => {
        setLoading(false);
        setSelectedRating(0);
        setReview('');
        setReviewSubmitted(true);

        return 'Your review has been submitted successfully!';
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
        Reviews
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
            {server.reviews.length} review{server.reviews.length > 1 ? 's' : ''}
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
            Note
          </h3>
          <span className='text-xs font-medium sm:text-sm text-tertiary'>
            Your review has been submitted for moderation. It will be visible once it has been approved.
          </span>
        </div>
      )}

      <div className="flex flex-col w-full mt-8 gap-y-8 sm:gap-y-0 sm:flex-row">
        {server.has_reviewed ? (
          <span className='text-sm font-medium text-tertiary'>
            You have already left a review for this server.
          </span>
        ) : server.ownerId === user.id ? (
          <span className='text-sm font-medium text-tertiary'>
            You can{'\''}t leave a review for your own server.
          </span>
        ) : (
          <>
            <div className="flex gap-x-4 w-[35%]">
              <Image
                src={user?.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                width={48}
                height={48}
                alt={`${user?.username || 'Unknown'}'s Avatar`}
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
                Your Review
              </h3>
              <p className='text-xs sm:text-sm text-tertiary'>
                {loggedIn ? 'Let others know what you think about this server.' : 'You must be logged in to leave a review.'}
              </p>
              
              <span 
                contentEditable={!loading && !reviewSubmitted && loggedIn}
                suppressContentEditableWarning 
                className={cn(
                  'text-sm sm:text-base block w-full lg:max-w-[450px] min-h-[100px] max-h-[200px] p-2 mt-4 overflow-y-auto border-2 border-transparent rounded-lg outline-none bg-secondary text-placeholder focus-visible:text-primary focus-visible:border-purple-500',
                  loading || reviewSubmitted || !loggedIn ? 'pointer-events-none opacity-80' : 'cursor-text'
                )} 
                onKeyUp={event => setReview(event.target.textContent)}
              />

              {loggedIn ? (
                <button
                  onClick={submitReview}
                  className='flex gap-x-1.5 items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-white bg-black rounded-lg dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70'
                  disabled={review.length === 0 || selectedRating === 0 || loading || reviewSubmitted}
                >
                  {loading && <TbLoader className='animate-spin' />}
                  Submit Review {selectedRating !== 0 && `(${selectedRating}/5)`}
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
          <div className="flex gap-x-4 w-[35%]">
            <Image
              src={review.user.avatar_url}
              width={48}
              height={48}
              alt={`${review.user.username}'s Avatar`}
              className='rounded-2xl w-[48px] h-[48px]'
            />

            <div className='flex flex-col gap-y-1'>
              <h3 className='flex items-center text-base font-semibold'>
                {review.user.username}
              </h3>
              <div className='flex items-center text-sm font-semibold text-tertiary'>
                <span className='text-xl text-primary'>{review.rating}</span>/5
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between flex-1 w-full font-medium whitespace-pre-wrap sm:gap-y-0 gap-y-2 text-secondary">
            <span className='text-xs font-medium text-tertiary'>
              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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