'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { t } from '@/stores/language';

const ReactCountdown = dynamic(() => import('react-countdown'), {
  ssr: false
});

export default function Countdown({ date }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <ReactCountdown
      date={date}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) return t('buttons.vote');

        return (
          <>
            <span className='hidden items-center gap-x-1 lg:flex'>
              {t('voteCountdown.desktop', { hours, minutes, seconds })}
            </span>

            <span className='flex items-center gap-x-1 lg:hidden'>
              {t('voteCountdown.mobile', { hours, minutes })}
            </span>
          </>
        );
      }}
      daysInHours={true}
    />
  ) : 'Loading..';
}