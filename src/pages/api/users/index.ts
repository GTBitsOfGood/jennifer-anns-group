import { z } from "zod";
import { createUser } from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { UserAlreadyExistsException } from "@/utils/exceptions/user";

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
      res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
  return;
}

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = createUserSchema.safeParse(JSON.parse(req.body));
  if (!parsedData.success) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      error: parsedData.error.format(),
    });
    return;
  }

  try {
    const user = await createUser(parsedData.data);
    res.status(HTTP_STATUS_CODE.CREATED).json({
      _id: user._id,
    });
    return;
  } catch (e) {
    let httpCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

    if (e instanceof UserAlreadyExistsException)
      httpCode = HTTP_STATUS_CODE.BAD_REQUEST;

    res.status(httpCode).json({
      error: (e as Error).message,
    });
    return;
  }
}
