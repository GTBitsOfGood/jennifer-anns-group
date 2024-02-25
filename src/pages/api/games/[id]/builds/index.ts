import {
  deleteBuild,
  getBuildUploadUrl,
} from "@/server/db/actions/BuildAction";
import { editGame, getGameById } from "@/server/db/actions/GameAction";
import { customErrorHandler } from "@/utils/exceptions";
import { NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
  try {
    const gameId = req.query.id;
    const game = await getGameById(req.query.id);
    if (game == null) {
      return res.status(404).send({
        success: false,
        error: `Could not find game with id: ${gameId}`,
      });
    }

    switch (req.method) {
      case "POST":
        const { uploadUrl, uploadAuthToken } = await getBuildUploadUrl();

        return res.status(200).send({
          success: true,
          message: "URL and auth token generated successfully",
          data: { uploadUrl, uploadAuthToken },
        });
      case "DELETE":
        await deleteBuild(gameId);
        await editGame({ id: gameId, data: { webGLBuild: false } });

        return res.status(200).send({
          success: true,
          message: "Build successfully deleted!",
        });
    }

    return res.status(405).send({
      success: false,
      message: `Request method ${req.method} is not allowed`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
