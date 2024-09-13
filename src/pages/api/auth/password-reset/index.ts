import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import jwt from "jsonwebtoken";

import { HTTP_STATUS_CODE } from "@/utils/consts";
import { getUserByEmail } from "@/server/db/actions/UserAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "PUT":
      return updatePasswordHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

const passwordObject = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

const emailObject = z.object({
  email: z.string().email("User has not been verified for password reset"),
});

async function updatePasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { password } = passwordObject.parse(JSON.parse(req.body));

    const { email } = emailObject.parse(
      jwt.decode(req.cookies.passwordResetJwt || ""),
    );

    const user = await getUserByEmail(email);
    // TODO: Enter code to update the user's password in the database

    return res
      .status(HTTP_STATUS_CODE.OK)
      .send("Succesfully updated the password");
  } catch (e: any) {
    console.error(e);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
