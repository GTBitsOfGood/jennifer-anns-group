import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import {
  customErrorHandler,
  GenericUserErrorException,
} from "@/utils/exceptions";

import {
  getGameById,
  deleteGame,
  editGame,
} from "@/server/db/actions/GameAction";
import { editGameSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const gameId = req.query.id;
    if (!gameId || Array.isArray(gameId)) {
      throw new GenericUserErrorException("ObjectId is invalid");
    }
    switch (req.method) {
      case "GET":
        const game = await getGameById(gameId);
        if (game == null) {
          return res.status(404).send({
            error: `Could not find game with id: ${gameId}`,
          });
        }
        return res.status(200).send({
          message: "Game retrieved successfully",
          data: game,
        });

      case "DELETE":
        //If no ID in query or not valid
        return await deleteGame(new ObjectId(gameId)).then(() => {
          return res.status(200).send({
            message: "Game successfully deleted!",
          });
        });
      case "PUT":
        //If no ID in query or not valid
        if (!gameId || !ObjectId.isValid(gameId)) {
          return res.status(422).send({
            error: "Invalid game ID has been specified for deletion.",
          });
        }
        //Ensures that edit requirement meets type requirements for each field
        const updateData = editGameSchema.safeParse(JSON.parse(req.body));
        if (!updateData.success) {
          return res.status(422).send({
            error: updateData.error.format(),
          });
        }
        return await editGame({ id: gameId, data: updateData.data }).then(
          () => {
            return res.status(200).send({
              message: "Game successfully edited!",
            });
          },
        );
    }
    return res.status(405).send({
      error: `Request method ${req.method} is not allowed`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
