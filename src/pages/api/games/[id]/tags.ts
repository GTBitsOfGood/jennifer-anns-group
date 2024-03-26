import {
  getGameById,
  deleteGame,
  editGame,
  editGameTags,
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
import { getTagsByType } from "@/server/db/actions/TagAction";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getTagsWithGameContextHandler(req, res);

    case "PUT":
      return putTagsWithGameContextHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getTagsWithGameContextHandler(
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

    const gameTags = new Set(game.tags.map((tag) => tag.name));

    const tags = await getTagsByType();
    const accessibilityTagsWithGameContext = tags.accessibility.map((tag) => ({
      ...tag.toObject(),
      checked: gameTags.has(tag.name),
    }));
    const customTagsWithGameContext = tags.custom.map((tag) => ({
      ...tag.toObject(),
      checked: gameTags.has(tag.name),
    }));

    return res.status(HTTP_STATUS_CODE.OK).send({
      accessibility: accessibilityTagsWithGameContext,
      custom: customTagsWithGameContext,
    });
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export type GetGameContextTagsOutput = {
  accessibility: (ExtendId<ITag> & { checked: boolean })[];
  custom: (ExtendId<ITag> & { checked: boolean })[];
};

export type PutTagsWithGameContextInput = z.infer<
  typeof putTagsWithGameContextSchema
>;

const putTagsWithGameContextSchema = z.object({
  type: z.literal("accessibility").or(z.literal("custom")),
  data: z.array(z.string().length(24)),
  gameId: z.string().length(24),
});

async function putTagsWithGameContextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const parsed = putTagsWithGameContextSchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      throw new GameInvalidInputException();
    }

    const input = parsed.data;

    const game = await getGameById(input.gameId);
    if (!game) {
      throw new GameNotFoundException();
    }

    const gameTags = game.tags.map((tag) => tag._id);
    const newGame = await editGameTags(
      game._id,
      gameTags,
      input.data,
      input.type,
    );

    return res.status(HTTP_STATUS_CODE.OK).send(newGame);
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
