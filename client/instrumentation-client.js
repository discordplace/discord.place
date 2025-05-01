import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://abf1a0a6fb7d466a88c69c971de26aef@gt.discord.place/1',
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.3,
  replaysOnErrorSampleRate: 1.0,
  debug: false
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;