import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.1
});