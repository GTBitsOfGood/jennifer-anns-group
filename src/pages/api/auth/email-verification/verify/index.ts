import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { HTTP_STATUS_CODE } from "@/utils/consts";
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
    const parsed = passwordResetParams.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send({ error: parsed.error.errors[0].message });
    }

    const { email, token } = parsed.data;
    const success = await verifyPasswordResetLog(email, token);
    if (!success) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ error: "Invalid email verification token provided" });
    }

    return res
      .status(HTTP_STATUS_CODE.OK)
      .send({ message: "Succesfully verified token" });
  } catch (e: any) {
    console.error(e);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
