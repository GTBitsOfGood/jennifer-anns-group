import { HTTP_STATUS_CODE } from "@/utils/consts";
import { createGame, getAllGames } from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const games = await getAllGames();
      return res.status(200).send(games);

    case "POST":
      const parsedData = gameSchema.safeParse(JSON.parse(req.body));
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
  return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
    error: `Request method ${req.method} is not allowed`,
  });
}
