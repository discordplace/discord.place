'use client';

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
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) return 'Vote';
        return (
          <>
            <span className='items-center hidden gap-x-1 lg:flex'>
              Wait {hours}h {minutes}m {seconds}s to vote
            </span>

            <span className='flex items-center gap-x-1 lg:hidden'>
              {hours}h {minutes}m {seconds}s
            </span>
          </>
        );
      }}
      daysInHours={true}
    />
  ) : 'Loading..';
}