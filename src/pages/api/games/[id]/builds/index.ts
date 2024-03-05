import { deleteBuild } from "@/server/db/actions/BuildAction";
import { editGame, getGameById } from "@/server/db/actions/GameAction";
import {
  GameNotFoundException,
  BuildUploadException,
  GameException,
  GameInvalidInputException,
  BuildNotFoundException,
} from "@/utils/exceptions/game";
import { NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { getDirectUploadUrl } from "@/pages/api/file";

export default async function handler(req: any, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return createBuildHandler(req, res);
    case "DELETE":
      return deleteBuildHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function createBuildHandler(req: any, res: NextApiResponse) {
  try {
    const game = await getGameById(req.query.id);
    if (!game) {
      throw new GameNotFoundException();
    }

    const { uploadUrl, uploadAuthToken } = await getDirectUploadUrl();
    console.log(uploadUrl, uploadAuthToken);
    if (!uploadUrl || !uploadAuthToken) {
      throw new BuildUploadException();
    }
    return res
      .status(HTTP_STATUS_CODE.CREATED)
      .send({ uploadUrl, uploadAuthToken });
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function deleteBuildHandler(req: any, res: NextApiResponse) {
  try {
    const gameId = req.query.id;
    if (!gameId || Array.isArray(gameId)) {
      throw new GameInvalidInputException();
    }

    const deletedBuild = await deleteBuild(gameId);
    if (!deletedBuild) {
      throw new BuildNotFoundException();
    }
    const editedGame = await editGame({
      id: gameId,
      data: { webGLBuild: false },
    });
    if (!editedGame) {
      throw new GameNotFoundException();
    }

    return res.status(HTTP_STATUS_CODE.OK).send(deletedBuild);
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
