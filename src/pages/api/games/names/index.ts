import { NextApiRequest, NextApiResponse } from "next";
import { fetchGameNames } from "@/server/db/actions/GameAction";
import { authenticate } from "../../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  //Authentication
  const authenticated = await authenticate(req, res, ["POST"], true);
  if (authenticated !== true) {
    return authenticated;
  }

  const { gameIds } = req.body;

  if (!Array.isArray(gameIds)) {
    return res
      .status(400)
      .json({ message: "Invalid input, expected an array of game IDs." });
  }

  try {
    const gameNames = await fetchGameNames(gameIds);
    return res.status(200).json({ gameNames });
  } catch (error) {
    console.error("Error fetching game names:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
