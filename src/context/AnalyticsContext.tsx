import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AnalyticsContextType {
  logCustomEvent: (
    eventType: string,
    eventName: string,
    properties: any,
  ) => Promise<void>;
  getAllCustomEvents: (
    projectName: string,
    category: string,
    subcategory: string,
    startDate: Date,
  ) => Promise<any>;
  getCustomEventsPaginated: (params: {
    projectName: string;
    environment: string;
    category: string;
    subcategory: string;
    limit: number;
    afterId?: string;
  }) => Promise<any>;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();

  const logCustomEvent = async (
    eventType: string,
    eventName: string,
    properties: any,
  ) => {
    if (!session?.user?.tracked) return;
    try {
      const response = await fetch("/api/events/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventType, eventName, properties }),
      });

      if (!response.ok) {
        throw new Error("Failed to log event");
      }
    } catch (error) {
      console.error("Error in logCustomEvent:", error);
    }
  };

  const getAllCustomEvents = async (
    projectName: string,
    category: string,
    subcategory: string,
    startDate: Date,
  ) => {
    try {
      const response = await fetch("/api/events/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "getAllCustomEvents",
          params: { projectName, category, subcategory, startDate },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getAllCustomEvents:", error);
      return null;
    }
  };

  const getCustomEventsPaginated = async (params: {
    projectName: string;
    environment: string;
    category: string;
    subcategory: string;
    limit: number;
    afterId?: string;
  }) => {
    try {
      const response = await fetch("/api/events/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "getCustomEventsPaginated",
          params,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch paginated events");
      }

      return await response.json();
    } catch (error) {
      console.error("Error in getCustomEventsPaginated:", error);
      return null;
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{ logCustomEvent, getAllCustomEvents, getCustomEventsPaginated }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
