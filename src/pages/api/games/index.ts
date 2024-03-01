import { HTTP_STATUS_CODE } from "@/utils/consts";
import { createGame, getAllGames } from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  GameInvalidInputException,
  GameException,
} from "../../../utils/exceptions/game";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getGamesHandler(req, res);
    case "POST":
      return postGameHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getGamesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const games = await getAllGames();
    return res.status(HTTP_STATUS_CODE.OK).send(games);
  } catch (e) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

async function postGameHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("PARSED", JSON.parse(req.body));
    const parsedData = gameSchema.safeParse(JSON.parse(req.body));
    if (!parsedData.success) {
      throw new GameInvalidInputException();
    }
    const newGame = await createGame(parsedData.data);
    console.log("NEWGAME", newGame);
    return res.status(HTTP_STATUS_CODE.CREATED).json({
      _id: newGame._id.toString(),
    });
  } catch (e) {
    if (e instanceof GameException) {
      return res.status(e.code).json(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
