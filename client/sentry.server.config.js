import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://abf1a0a6fb7d466a88c69c971de26aef@gt.discord.place/1',
  tracesSampleRate: 1,
  debug: false
});