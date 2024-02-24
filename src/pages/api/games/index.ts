import { customErrorHandler } from "@/utils/exceptions";
import {
  createGame,
  getSelectedGames,
} from "../../../server/db/actions/GameAction";
import { gameSchema, gameSchemaAPI } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import { GetGameQuerySchema } from "../../../utils/types";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET":
        //Validate req.query
        const query = GetGameQuerySchema.parse(req.query); //JSON.parse not necessary

        const games = await getSelectedGames(query);
        return res.status(200).send({
          data: games,
        });

      case "POST":
        //How can I ensure that the values in req.body? are strings convertable to objects.

        const parsedData = gameSchemaAPI.safeParse(JSON.parse(req.body));
        if (!parsedData.success) {
          return res.status(422).send({
            error: parsedData.error.format(),
          });
        }
        const result = await createGame(parsedData.data);
        return res.status(201).send({
          data: { id: result },
        });
    }
    return res.status(405).send({
      error: `Request method ${req.method} is not allowed`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
