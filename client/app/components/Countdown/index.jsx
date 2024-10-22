'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ReactCountdown = dynamic(() => import('react-countdown'), {
  ssr: false
});

export default function Countdown({ date, renderer }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <ReactCountdown
      date={date}
      daysInHours={true}
      renderer={renderer}
    />
  ) : 'Loading..';
}