import { createUser, editUser, getUser, editPassword } from "../../../server/db/actions/UserAction";
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
  if (req.method === "GET") {
    const { email } = req.query; // Extract email from query parameters
    try {
      const user = await getUser(email); 
      if (!user) {
        return res.status(404).send({
          success: false,
          message: `Could not find user with email ${email}`,
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

  if (req.method === "PUT") {
    const { type } = req.query;
    if (type === "info") {
      // Editing user profile
      try {
        const result = await editUser(req.body);
        return res.status(200).send({
          success: true,
          message: "User information updated successfully",
          data: result,
        });
      } catch (error: any) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    } else if (type === "password") {
      // Editing user password
      try {
        const result = await editPassword(req.body);
        return res.status(result.status).send({
          success: result.status === 200,
          message: result.message,
        });
      } catch (error: any) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid request type",
      });
    }
  }
  
  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
