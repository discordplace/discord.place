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
      includeComma
      animateToNumber={data}
      config={{ tension: 100, friction: 10 }}
      locale='en-US'
    />
  ) : '0';
}