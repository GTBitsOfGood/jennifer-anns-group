import { getViewer } from "@/lib/analytics";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const viewer = getViewer();
  const { method, params } = req.body;

  try {
    if (method === "getAllCustomEvents") {
      const { projectName, category, subcategory, startDate } = params;
      const events = await viewer.getAllCustomEvents(
        projectName,
        category,
        subcategory,
        new Date(startDate),
      );
      return res.status(200).json(events);
    }

    if (method === "getCustomEventsPaginated") {
      const {
        projectName,
        environment,
        category,
        subcategory,
        limit,
        afterId,
      } = params;
      const events = await viewer.getCustomEventsPaginated({
        projectName,
        environment,
        category,
        subcategory,
        limit,
        afterId,
      });
      return res.status(200).json(events);
    }

    return res.status(400).json({ message: "Invalid method" });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
