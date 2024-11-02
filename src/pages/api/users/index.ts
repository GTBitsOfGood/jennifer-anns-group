import { z } from "zod";
import {
  createUser,
  getUserByEmail,
} from "../../../server/db/actions/UserAction";
import cookie from "cookie";

import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  UserInvalidInputException,
  UserException,
  UserDoesNotExistException,
  GenericUserErrorException,
} from "@/utils/exceptions/user";
import jwt from "jsonwebtoken";

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
//Needs to be insecure but also is a weekendpoint
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

const emailObject = z.object({
  email: z.string().email("Email has not been verified"),
});
async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  //Ensure verification for key

  try {
    if (!req.cookies.emailVerificationJwt) {
      throw new GenericUserErrorException(
        "Email Verification Process incomplete.",
      );
    }
    const { email } = emailObject.parse(
      jwt.verify(req.cookies.emailVerificationJwt, process.env.NEXTAUTH_SECRET),
    );
    const parsedData = createUserSchema.safeParse(JSON.parse(req.body));
    if (!parsedData.success) {
      throw new UserInvalidInputException();
    }
    //Invalid cookie in this case
    if (email !== parsedData.data.email) {
      throw new UserInvalidInputException();
    }

    const newUser = await createUser(parsedData.data);
    //Invalidate Cookie
    const serializedCookie = cookie.serialize(
      "emailVerificationJwt",
      "invalidValue",
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0, // Expire the cookie
        path: "/",
      },
    );
    return res
      .status(HTTP_STATUS_CODE.CREATED)
      .setHeader("Set-Cookie", serializedCookie)
      .send({
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
