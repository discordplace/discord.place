'use client';

import config from '@/config';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  const initPostHog = process.env.NODE_ENV === 'production' || (process.env.NODE_ENV === 'development' && config.__DISABLE_POST_HUG_ON_DEVELOPMENT !== true);

  if (initPostHog) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'always'
    });
  }
}

export default function CSPostHogProvider({ children }) {
  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
}