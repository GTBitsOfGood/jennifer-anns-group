import mongoose from "mongoose";
import {
  getGameById,
  deleteGame,
  editGame,
} from "@/server/db/actions/GameAction";
import { editGameSchema } from "@/utils/types";

export default async function handler(req: any, res: any) {
  const gameId = req.query.id;
  switch (req.method) {
    case "GET":
      try {
        const game = await getGameById(gameId);
        if (game == null) {
          return res.status(404).send({
            success: false,
            message: `Could not find game with id: ${gameId}`,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Game retrieved successfully",
          data: game,
        });
      } catch (error: any) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    case "DELETE":
      //If no ID in query or not valid
      if (!req.query.id || !mongoose.Types.ObjectId.isValid(req.query.id)) {
        return res.status(422).send({
          success: false,
          message: "Invalid game ID has been specified for deletion.",
        });
      }
      return deleteGame(req.query.id)
        .then(() => {
          return res.status(200).send({
            success: true,
            message: "Game successfully deleted!",
          });
        })
        .catch((error) => {
          //Reference error if bad ID
          if (error instanceof ReferenceError) {
            ``;
            return res.status(400).send({
              success: false,
              message: error.message,
            });
          }
          return res.status(500).send({
            success: false,
            message: error.message,
          });
        });
    case "PUT":
      //If no ID in query or not valid
      if (!req.query.id || !mongoose.Types.ObjectId.isValid(req.query.id)) {
        return res.status(422).send({
          success: false,
          message: "Invalid game ID has been specified for deletion.",
        });
      }
      //Ensures that edit requirement meets type requirements for each field
      const updateData = editGameSchema.safeParse(req.body);
      if (!updateData.success) {
        return res.status(422).send({
          success: false,
          message: updateData.error.format(),
        });
      }
      return editGame({ id: req.query.id, data: updateData.data })
        .then(() => {
          return res.status(200).send({
            success: true,
            message: "Game successfully edited!",
          });
        })
        .catch((error) => {
          //Reference error if bad ID
          if (error instanceof ReferenceError) {
            return res.status(400).send({
              success: false,
              message: error.message,
            });
          }
          return res.status(500).send({
            success: false,
            message: error.message,
          });
        });
  }
  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
