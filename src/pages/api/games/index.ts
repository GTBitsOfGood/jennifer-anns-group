import { createGame } from "../../../server/actions/Game";
import { gameSchema } from "../../../utils/types";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
    const parsedData = gameSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).send({
        success: false,
        message:
          "The field " +
          Object.keys(parsedData.error.format())[1] +
          " is invalid",
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
