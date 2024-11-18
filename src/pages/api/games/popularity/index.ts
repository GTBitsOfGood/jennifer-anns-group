import { updateGamesPopularity } from "@/server/db/actions/GameAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return updatePopularityHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function updatePopularityHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const requestKey = req.headers["x-api-key"];
    if (requestKey !== process.env.GAME_POPULARITY_CRON_KEY) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json({ error: "Invalid secret provided." });
    }

    await updateGamesPopularity();

    return res.status(HTTP_STATUS_CODE.OK).json({ message: "Success" });
  } catch (e: any) {
    console.error("Error updating game popularity:", e);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: e.message });
  }
}
