import { z } from "zod";
import { createUser } from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  UserInvalidInputException,
  UserException,
} from "@/utils/exceptions/user";

export const createUserSchema = userSchema
  .omit({ hashedPassword: true })
  .extend({
    password: z.string(),
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return createUserHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = createUserSchema.safeParse(JSON.parse(req.body));
    if (!parsedData.success) {
      throw new UserInvalidInputException();
    }

    const newUser = await createUser(parsedData.data);
    return res.status(HTTP_STATUS_CODE.CREATED).send({
      _id: newUser._id,
    });
  } catch (e) {
    if (e instanceof UserException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
