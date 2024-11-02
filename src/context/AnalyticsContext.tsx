import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AnalyticsLogger,
  AnalyticsViewer,
  EventEnvironment,
} from "bog-analytics";
interface AnalyticsContextType {
  analyticsLogger: AnalyticsLogger;
  analyticsViewer: AnalyticsViewer;
}

// Create context for provider
const AnalyticsContext = createContext<AnalyticsContextType | null>(null);
const clientApiKey = process.env
  .NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string;
const serverApiKey = process.env.BOG_BOG_ANALYTICS_SERVER_API_KEY as string;

const devLogger = new AnalyticsLogger({
  apiBaseUrl: "https://data.bitsofgood.org",
  environment: EventEnvironment.DEVELOPMENT,
});

const prodLogger = new AnalyticsLogger({
  apiBaseUrl: "https://data.bitsofgood.org",
  environment: EventEnvironment.PRODUCTION,
});

export async function authenticateLoggers() {
  switch (process.env.NODE_ENV) {
    case "development":
      await devLogger.authenticate(clientApiKey);
      break;
    case "production":
      await prodLogger.authenticate(clientApiKey);
      break;
  }
}

authenticateLoggers(); // Specifically for front-end

export function getLogger() {
  switch (process.env.NODE_ENV) {
    case "production":
      return prodLogger;
    case "development":
      return devLogger;
    default:
      return devLogger; // Might need to change this in future
  }
}

const logger = getLogger;

const devViewer = new AnalyticsViewer({
  apiBaseUrl: "https://data.bitsofgood.org",
  environment: EventEnvironment.DEVELOPMENT,
});

const prodViewer = new AnalyticsViewer({
  apiBaseUrl: "https://data.bitsofgood.org",
  environment: EventEnvironment.PRODUCTION,
});

async function authenticateViewers() {
  switch (process.env.NODE_ENV) {
    case "production":
      await prodViewer.authenticate(serverApiKey);
      break;
    case "development":
      await devViewer.authenticate(serverApiKey);
      break;
  }
}

authenticateViewers();

export function getViewer() {
  switch (process.env.NODE_ENV) {
    case "production":
      return prodViewer;
    case "development":
      return devViewer;
    default:
      return devViewer; // Might need to change this in future
  }
}

const viewer = getViewer;

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const [analyticsLogger] = useState<AnalyticsLogger>(logger);
  const [analyticsViewer] = useState<AnalyticsViewer>(viewer);
  return (
    <AnalyticsContext.Provider value={{ analyticsLogger, analyticsViewer }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics has to be used within an AnalyticsProvider");
  }
  return context;
};

interface visitProperties {
  referrer: string;
  userId: string;
  createdDate: string;
  userGroup: string;
  browserAgent: string;
}

//// Custom Visit Event Logger (Might not be useful anymore, as custom visit logged in middleware)

export async function logVisitEventServer(
  logger: AnalyticsLogger,
  properties: visitProperties,
) {
  await logger.logCustomEvent("Visit", "Visit", properties);
}

export function getBrowserName(userAgent: string) {
  // The order matters here, and this may report false positives for unlisted browsers.
  if (userAgent.includes("Firefox")) {
    return "Mozilla Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else if (userAgent.includes("Edge")) {
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.includes("Edg")) {
    return "Microsoft Edge (Chromium)";
  } else if (userAgent.includes("Chrome")) {
    return "Google Chrome or Chromium";
  } else if (userAgent.includes("Safari")) {
    return "Apple Safari";
  } else {
    return "unknown";
  }
}
