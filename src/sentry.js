import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || "development";
const RELEASE = import.meta.env.VITE_APP_VERSION || "unknown";
const IS_PRODUCTION = ENVIRONMENT === "production";
const IS_DEVELOPMENT = ENVIRONMENT === "development";

const getTracesSampleRate = () => {
  const customRate = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE;
  if (customRate) {
    return parseFloat(customRate);
  }
  return IS_PRODUCTION ? 0.1 : 1.0;
};

export const initSentry = () => {
  if (!SENTRY_DSN) {
    if (IS_DEVELOPMENT) {
      console.warn("Sentry DSN not configured. Error tracking disabled.");
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,
    integrations: [
      browserTracingIntegration(),
    ],
    tracesSampleRate: getTracesSampleRate(),
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
    ],
  });
};

