import {
  deleteBuild,
  getBuildUploadUrl,
} from "@/server/db/actions/BuildAction";
import { getGameById } from "@/server/db/actions/GameAction";
import { NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
  const gameId = req.query.id;
  const game = await getGameById(req.query.id);
  if (game == null) {
    return res.status(404).send({
      success: false,
      message: `Could not find game with id: ${gameId}`,
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

      return res.status(200).send({
        success: true,
        message: "Builds successfully deleted!",
      });
  }

  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
