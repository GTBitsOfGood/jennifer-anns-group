import { AnalyticsLogger, EventEnvironment } from "bog-analytics";

const devLogger = new AnalyticsLogger({
  environment: EventEnvironment.DEVELOPMENT,
});
const clientApiKey = process.env
  .NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string;

const getAnalyticsLogger = async () => {
  await devLogger.authenticate(clientApiKey);
  return devLogger;
  // add options for other environments (production, staging) later
};

export default getAnalyticsLogger;
