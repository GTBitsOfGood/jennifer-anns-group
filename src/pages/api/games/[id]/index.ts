import {
  getGameById,
  deleteGame,
  editGame,
} from "@/server/db/actions/GameAction";
import { editGameSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  GameInvalidInputException,
  GameNotFoundException,
  GameException,
} from "@/utils/exceptions/game";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getGameByIdHandler(req, res);
    case "DELETE":
      return deleteGameHandler(req, res);
    case "PUT":
      return editGameHandler(req, res);
  }
  return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
    error: `Request method ${req.method} is not allowed`,
  });
}

async function getGameByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gameId = req.query.id;
    if (!gameId || Array.isArray(gameId)) {
      throw new GameInvalidInputException();
    }

    const game = await getGameById(gameId);
    if (!game) {
      throw new GameNotFoundException();
    }
    return res.status(HTTP_STATUS_CODE.OK).send(game);
  } catch (e) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

async function deleteGameHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gameId = req.query.id;
    if (!gameId || Array.isArray(gameId)) {
      throw new GameInvalidInputException();
    }

    const deletedGame = await deleteGame(new mongoose.Types.ObjectId(gameId));
    if (!deletedGame) {
      throw new GameNotFoundException();
    }
    return res.status(HTTP_STATUS_CODE.OK).send(deletedGame);
  } catch (e) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

async function editGameHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gameId = req.query.id as string;
    if (!gameId || !mongoose.isValidObjectId(gameId)) {
      throw new GameInvalidInputException();
    }

    const updateData = editGameSchema.safeParse(JSON.parse(req.body));
    if (!updateData.success) {
      throw new GameInvalidInputException();
    }

    const editedGame = await editGame({ id: gameId, data: updateData.data });
    return res.status(HTTP_STATUS_CODE.OK).send(editedGame);
  } catch (e) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
