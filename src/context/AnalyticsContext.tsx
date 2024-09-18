import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnalyticsLogger, EventEnvironment } from "bog-analytics";

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
  apiBaseUrl: "https://data.bitsofgood.org/",
  environment: EventEnvironment.DEVELOPMENT,
});

async function authenticateLoggers() {
  await devLogger.authenticate(clientApiKey);
}
authenticateLoggers();

function getLogger() {
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
