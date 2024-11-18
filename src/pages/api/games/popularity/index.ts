import { updateGamesPopularity } from "@/server/db/actions/GameAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";

// Set a longer timeout for this API route
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
};

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

    try {
      await updateGamesPopularity();
    } catch (updateError: any) {
      console.error("Detailed update error:", {
        message: updateError.message,
        stack: updateError.stack,
        cause: updateError.cause,
      });
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        error: "Error updating game popularity",
        code: "UPDATE_FAILED",
      });
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      success: true,
    });
  } catch (e: any) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
}
