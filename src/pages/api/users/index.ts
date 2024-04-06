import { z } from "zod";
import {
  createUser,
  getUserByEmail,
} from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  UserInvalidInputException,
  UserException,
  UserDoesNotExistException,
} from "@/utils/exceptions/user";

export const createUserSchema = userSchema
  .omit({ hashedPassword: true, notes: true })
  .extend({
    password: z.string(),
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getUserHandler(req, res);
    case "POST":
      return createUserHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getUserHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = String(req.query.email);
    const user = await getUserByEmail(email);
    if (!user) throw new UserDoesNotExistException();
    res.status(HTTP_STATUS_CODE.OK).send(user);
  } catch (e: any) {
    if (e instanceof UserException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
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
  } catch (e: any) {
    if (e instanceof UserException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
