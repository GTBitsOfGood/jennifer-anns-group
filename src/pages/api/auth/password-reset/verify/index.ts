import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { HTTP_STATUS_CODE } from "@/utils/consts";
import { getUserByEmail } from "@/server/db/actions/UserAction";
import { verifyPasswordResetLog } from "@/server/db/actions/VerificationLogAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return verifyPasswordResetHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

const passwordResetParams = z.object({
  email: z.string().email("Email is not valid"),
  token: z.string().length(6),
});

async function verifyPasswordResetHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { email, token } = passwordResetParams.parse(JSON.parse(req.body));
    const user = await getUserByEmail(email); // This function will throw an error if the user does not exist

    const success = await verifyPasswordResetLog(email, token);
    if (!success) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).send("Invalid token");
    }

    // Set a temporary cookie with the signed email to be used in the API endpoint to reset the password
    const serializedCookie = cookie.serialize(
      "passwordResetJwt",
      jwt.sign({ email }, process.env.NEXTAUTH_SECRET),
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 15, // 15 minutes
        path: "/",
      },
    );

    return res
      .status(HTTP_STATUS_CODE.OK)
      .setHeader("Set-Cookie", serializedCookie)
      .send("Succesfully verified token");
  } catch (e: any) {
    console.error(e);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
