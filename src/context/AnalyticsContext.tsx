import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AnalyticsLogger,
  CustomEventType,
  EventEnvironment,
} from "bog-analytics";
import { apiBaseUrl } from "next-auth/client/_utils";

//// Create Context

interface AnalyticsContextType {
  analyticsLogger: AnalyticsLogger;
  // can add manager / viewer in the future
}
const AnalyticsContext = createContext<AnalyticsContextType | null>(null);
//// Create Provider

const clientApiKey = process.env
  .NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string;

const devLogger = new AnalyticsLogger({
  apiBaseUrl: "https://data.bitsofgood.org",
  environment: EventEnvironment.DEVELOPMENT,
});

export async function authenticateLoggers() {
  await devLogger.authenticate(clientApiKey);
}
authenticateLoggers(); //Specifically for front-end

export function getLogger() {
  // return logger corresponding to current environment
  return devLogger;
  // add options for other environments later
}
const logger = getLogger;

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const [analyticsLogger] = useState<AnalyticsLogger>(logger);
  return (
    <AnalyticsContext.Provider value={{ analyticsLogger }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

//// Hook

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics has to be used within an AnalyticsProvider");
  }
  return context;
};

//

interface visitProperties {
  referrer: string;
  userId: string;
  createdDate: string;
  // userGroup: string;
  browserAgent: string;
}

//// Custom Visit Event Logger (Might not be useful anymore, as custom visit logged in middleware)

export async function logVisitEventServer(
  logger: AnalyticsLogger,
  properties: visitProperties,
) {
  await logger.logCustomEvent("Visit", "Visit", properties);
  console.log("Successfully logged event");
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
