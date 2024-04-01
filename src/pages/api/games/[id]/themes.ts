import {
  getGameById,
  deleteGame,
  editGame,
} from "@/server/db/actions/GameAction";
import { ExtendId, editGameSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  GameInvalidInputException,
  GameNotFoundException,
  GameException,
} from "@/utils/exceptions/game";
import mongoose from "mongoose";
import { getThemes } from "@/server/db/actions/ThemeAction";
import { ITheme } from "@/server/db/models/ThemeModel";
import { ITag } from "@/server/db/models/TagModel";
import { GetGameContextTagsOutput } from "./tags";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getThemesWithGameContextHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getThemesWithGameContextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const gameId = req.query.id;
    if (!gameId || Array.isArray(gameId)) {
      throw new GameInvalidInputException();
    }

    const game = await getGameById(gameId);
    if (!game) {
      throw new GameNotFoundException();
    }

    const gameThemes = new Set(game.themes.map((theme) => theme.name));

    const themes = await getThemes();
    const themesWithGameContext = themes.map((theme) => ({
      ...theme,
      checked: gameThemes.has(theme.name),
    }));

    return res.status(HTTP_STATUS_CODE.OK).send(themesWithGameContext);
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export type GetGameContextThemesOutput = (ExtendId<ITheme> & {
  checked: boolean;
})[];

export type GetGameContextOutput =
  | GetGameContextThemesOutput
  | GetGameContextTagsOutput;
