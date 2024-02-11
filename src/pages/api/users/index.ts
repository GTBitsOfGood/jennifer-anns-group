import { createUser, getUser } from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";

export default async function handler(req: any, res: any) {
  if (req.method == "POST") {
    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(422).send({
        success: false,
        message: parsedData.error.format(),
      });
    }

    return createUser(parsedData.data)
      .then((id) => {
        return res.status(201).send({
          success: true,
          message: "New user created!",
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
  if (req.method == "GET") {
    try {
      const user = await getUser(req.body.email);
      if (user == null) {
        return res.status(404).send({
          success: false,
          message: `Could not find user with email ${req.body.email}`,
        });
      }
      return res.status(200).send({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
