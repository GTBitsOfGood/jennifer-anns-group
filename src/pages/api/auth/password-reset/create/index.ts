import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";

import { HTTP_STATUS_CODE } from "@/utils/consts";
import { getUserByEmail } from "@/server/db/actions/UserAction";
import { createPasswordResetLog } from "@/server/db/actions/VerificationLogAction";
import { sendPasswordResetEmail } from "@/server/db/actions/EmailAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return sendPasswordResetEmailHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

const emailObject = z.object({
  email: z.string().email("Email is not valid"),
});

export type EmailData = z.infer<typeof emailObject>;
async function sendPasswordResetEmailHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { email } = emailObject.parse(JSON.parse(req.body));
    const user = await getUserByEmail(email); // This function will throw an error if the user does not exist

    const passwordResetLog = await createPasswordResetLog(email);
    await sendPasswordResetEmail(email, passwordResetLog.token);

    return res.status(HTTP_STATUS_CODE.CREATED).send("Succesfully sent email");
  } catch (e: any) {
    console.error(e);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
