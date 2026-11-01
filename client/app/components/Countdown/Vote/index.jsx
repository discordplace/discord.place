'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ReactCountdown = dynamic(() => import('react-countdown'), {
  ssr: false
});

export default function Countdown({ date }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <ReactCountdown
      date={date}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) return t('buttons.vote');

        // `hours` is always 0-23, so include the days to display the total hours.
        const totalHours = (days * 24) + hours;

        return (
          <>
            <span className='hidden items-center gap-x-1 lg:flex'>
              {t('voteCountdown.desktop', { hours: totalHours, minutes, seconds })}
            </span>

            <span className='flex items-center gap-x-1 lg:hidden'>
              {t('voteCountdown.mobile', { hours: totalHours, minutes })}
            </span>
          </>
        );
      }}
      daysInHours={true}
    />
  ) : 'Loading..';
}