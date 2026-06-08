import Tracker from '@openreplay/tracker';
import config from '@/config';

const trackerOptions = {
  projectKey: config.openreplay.projectKey,
  ingestPoint: config.openreplay.ingestPoint,
  __DISABLE_SECURE_MODE: process.env.NODE_ENV === 'development'
};

export const tracker = typeof window !== 'undefined' ? new Tracker(trackerOptions) : null;