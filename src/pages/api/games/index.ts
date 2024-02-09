import mongoose from "mongoose";
import { createGame, getAllGames } from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";
import { ObjectId } from "mongodb";
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
      console.log(req.body);
      //How can I ensure that the values in req.body? are strings convertable to objects.
      const parsedData = gameSchema.safeParse(req.body);
      console.log(parsedData);
      if (!parsedData.success) {
        return res.status(422).send({
          success: false,
          message: parsedData.error.format(),
        });
      }
      if (parsedData.data.tags) {

                
        for (let i = 0; i < parsedData.data.tags.length; i++) {
            parsedData.data.tags[i] = new ObjectId(parsedData.data.tags[i]);
            
        }
    }
    if (parsedData.data.themes) {

                
      for (let i = 0; i < parsedData.data.themes.length; i++) {
          parsedData.data.themes[i] = new ObjectId(parsedData.data.themes[i]);
          
      }
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
  }
  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
