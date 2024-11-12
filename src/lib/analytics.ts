import {
  AnalyticsLogger,
  AnalyticsViewer,
  EventEnvironment,
} from "bog-analytics";

let devLoggerInstance: AnalyticsLogger | null = null;
let prodLoggerInstance: AnalyticsLogger | null = null;
let devViewerInstance: AnalyticsViewer | null = null;
let prodViewerInstance: AnalyticsViewer | null = null;
const BASE_URL = "https://data.bitsofgood.org";

function createLogger(environment: EventEnvironment) {
  const clientApiKey = process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY;
  if (environment === EventEnvironment.DEVELOPMENT) {
    if (!devLoggerInstance) {
      devLoggerInstance = new AnalyticsLogger({
        apiBaseUrl: BASE_URL,
        environment: EventEnvironment.DEVELOPMENT,
      });
      devLoggerInstance.authenticate(clientApiKey as string);
    }
    return devLoggerInstance;
  } else {
    if (!prodLoggerInstance) {
      prodLoggerInstance = new AnalyticsLogger({
        apiBaseUrl: BASE_URL,
        environment: EventEnvironment.PRODUCTION,
      });
      prodLoggerInstance.authenticate(clientApiKey as string);
    }
    return prodLoggerInstance;
  }
}

function createViewer(environment: EventEnvironment) {
  const serverApiKey = process.env.BOG_BOG_ANALYTICS_SERVER_API_KEY;
  if (environment === EventEnvironment.DEVELOPMENT) {
    if (!devViewerInstance) {
      devViewerInstance = new AnalyticsViewer({
        apiBaseUrl: BASE_URL,
        environment: EventEnvironment.DEVELOPMENT,
      });
      devViewerInstance.authenticate(serverApiKey as string);
    }
    return devViewerInstance;
  } else {
    if (!prodViewerInstance) {
      prodViewerInstance = new AnalyticsViewer({
        apiBaseUrl: BASE_URL,
        environment: EventEnvironment.PRODUCTION,
      });
      prodViewerInstance.authenticate(serverApiKey as string);
    }
    return prodViewerInstance;
  }
}

export function getLogger() {
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? createLogger(EventEnvironment.PRODUCTION)
    : createLogger(EventEnvironment.DEVELOPMENT);
}

export function getViewer() {
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? createViewer(EventEnvironment.PRODUCTION)
    : createViewer(EventEnvironment.DEVELOPMENT);
}

export interface visitProperties {
  referrer: string;
  pageUrl: string;
  userId: string;
  createdDate: string;
  userGroup: string;
  browserAgent: string;
}

export async function logVisitEventServer(
  logger: AnalyticsLogger,
  properties: visitProperties,
) {
  await logger.logCustomEvent("Visit", "Visit", properties);
}

export function getBrowserName(userAgent: string) {
  if (!userAgent) return "unknown";
  if (userAgent.includes("Firefox")) return "Mozilla Firefox";
  if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
  if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
  if (userAgent.includes("Edge")) return "Microsoft Edge (Legacy)";
  if (userAgent.includes("Edg")) return "Microsoft Edge (Chromium)";
  if (userAgent.includes("Chrome")) return "Google Chrome or Chromium";
  if (userAgent.includes("Safari")) return "Apple Safari";
  return "unknown";
}
