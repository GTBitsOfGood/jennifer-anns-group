import { z } from "zod";
import { createUser, editUser, getUser, editPassword } from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_METHOD_NOT_ALLOWED,
} from "@/utils/consts";
import { UserAlreadyExistsException } from "@/utils/exceptions";

export const createUserSchema = userSchema
  .omit({ hashedPassword: true })
  .extend({
    password: z.string(),
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await createUserHandler(req, res);
      break;
    default:
      res.status(HTTP_METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
  if (req.method === "GET") {
    const email = String(req.query.email);
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
  return;
}

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(HTTP_BAD_REQUEST).json({
      error: parsedData.error.format(),
    });
    return;
  }

  try {
    const user = await createUser(parsedData.data);
    res.status(HTTP_CREATED).json({
      _id: user._id,
    });
    return;
  } catch (e) {
    let httpCode = HTTP_INTERNAL_SERVER_ERROR;

    if (e instanceof UserAlreadyExistsException) httpCode = HTTP_BAD_REQUEST;

    res.status(httpCode).json({
      error: (e as Error).message,
    });
    return;
  }
}
