'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AnimatedNumbers = dynamic(() => import('react-animated-numbers'), {
  ssr: false
});

export default function AnimatedCount({ data }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return loaded ? (
    <AnimatedNumbers
      animateToNumber={data}
      config={{ friction: 10, tension: 100 }}
      includeComma
      locale='en-US'
    />
  ) : '0';
}