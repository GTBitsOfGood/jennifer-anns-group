import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { HTTP_STATUS_CODE } from "@/utils/consts";
import { getUserByEmail, resetPassword } from "@/server/db/actions/UserAction";

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
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const emailObject = z.object({
  email: z.string().email("User has not been verified for password reset"),
});

async function updatePasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { email } = emailObject.parse(
      jwt.decode(req.cookies.passwordResetJwt || ""),
    );
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ error: "User not found" });
    }

    const { newPassword } = passwordObject.parse(JSON.parse(req.body));
    if (!newPassword) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send({ error: "New password is required" });
    }

    await resetPassword(newPassword, String(user._id));

    const serializedCookie = cookie.serialize(
      "passwordResetJwt",
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
      .status(HTTP_STATUS_CODE.OK)
      .setHeader("Set-Cookie", serializedCookie)
      .send({ message: "Password reset successfully" });
  } catch (e: any) {
    console.error(e);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
