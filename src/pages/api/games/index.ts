import { customErrorHandler } from "@/utils/exceptions";
import { createGame, getAllGames } from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET":
        const games = await getAllGames();
        return res.status(200).send({
          message: "Games retrieved successfully",
          data: games,
        });

      case "POST":
        //How can I ensure that the values in req.body? are strings convertable to objects.

        const parsedData = gameSchema.safeParse(JSON.parse(req.body));
        if (!parsedData.success) {
          return res.status(422).send({
            error: parsedData.error.format(),
          });
        }

        console.log("parsed", parsedData);
        const result = await createGame(parsedData.data);
        console.log(result);
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
