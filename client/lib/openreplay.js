import Tracker from '@openreplay/tracker';
import config from '@/config';

const trackerOptions = {
  __DISABLE_SECURE_MODE: process.env.NODE_ENV === 'development',
  ingestPoint: config.openreplay.ingestPoint,
  projectKey: config.openreplay.projectKey
};

export const tracker = typeof globalThis.window !== 'undefined' ? new Tracker(trackerOptions) : null;