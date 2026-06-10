import { init as initSentry, captureRouterTransitionStart, replayIntegration, browserSessionIntegration, httpClientIntegration } from '@sentry/nextjs';

initSentry({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  integrations: [
    replayIntegration({
      blockAllMedia: false,
      maskAllInputs: false,
      maskAllText: false
    }),
    browserSessionIntegration({
      type: 'page'
    }),
    httpClientIntegration({
      dataCollection: {
        cookies: true,
        httpHeaders: true
      }
    })
  ],
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.25,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.1
});

export const onRouterTransitionStart = captureRouterTransitionStart;