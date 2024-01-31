import mongoose from "mongoose";
import {
  createGame,
  deleteGame,
  editGame,
  getAllGames,
} from "../../../server/db/actions/GameAction";
import { editGameSchema, gameSchema } from "../../../utils/types";

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case "GET":
      try {
        const games = await getAllGames();
        return res.status(200).send({
          success: true,
          message: "Games retrieved successfully",
          data: games,
        });
      } catch (error: any) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    case "POST":
      const parsedData = gameSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(422).send({
          success: false,
          message: parsedData.error.format(),
        });
      }
      return createGame(parsedData.data)
        .then((id) => {
          return res.status(201).send({
            success: true,
            message: "New game created!",
            data: { _id: id },
          });
        })
        .catch((error) => {
          //MongoDB Error Code 11000 is for duplicate input
          if (error.hasOwnProperty("code") && error.code == 11000) {
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
