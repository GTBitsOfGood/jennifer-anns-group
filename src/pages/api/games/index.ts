import { createGame } from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
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
  }
  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
