// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: "https://9c100964276d59a3b97f36acb3638bb1@o4510392286773248.ingest.de.sentry.io/4510392314363984",

  // Define how likely traces are sampled.
  tracesSampleRate: 1,
  
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  sendDefaultPii: true,

  // Add your integrations here
  integrations: [
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here
      colorScheme: "system",
    }),
  ],
});