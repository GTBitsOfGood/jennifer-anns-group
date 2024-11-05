import { getLogger } from "@/lib/analytics";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { eventType, eventName, properties } = req.body;

  try {
    const logger = getLogger();
    await logger.logCustomEvent(eventType, eventName, properties);
    return res.status(200).json({ message: "Event logged successfully" });
  } catch (error) {
    console.error("Error logging event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
