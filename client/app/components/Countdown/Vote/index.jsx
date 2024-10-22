'use client';

import { t } from '@/stores/language';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

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
      daysInHours={true}
      renderer={({ completed, hours, minutes, seconds }) => {
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
    />
  ) : 'Loading..';
}