import { z } from "zod";
import { createUser } from "../../../server/db/actions/UserAction";
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
