'use client';

import { useEffect } from 'react';
import { tracker } from '@/lib/openreplay';

export default function OpenReplay() {
  useEffect(() => {
    if (tracker) {
      tracker.start().catch(error => console.error('OpenReplay failed to start:', error));
    }
  }, []);

  return null;
}