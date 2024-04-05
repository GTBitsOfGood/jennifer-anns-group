import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { EmailInvalidInputException } from "@/utils/exceptions/email";
import { emailSchema } from "@/utils/types";
import { sendEmail } from "@/server/db/actions/EmailAction";
import z from "zod";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return sendEmailHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}
export type EmailData = z.infer<typeof emailSchema>;
async function sendEmailHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = emailSchema.safeParse(JSON.parse(req.body));
    console.log(parsedData);
    if (!parsedData.success) {
      throw new EmailInvalidInputException();
    }
    await sendEmail(parsedData.data);
    return res.status(HTTP_STATUS_CODE.OK).send("Succesfully sent email");
  } catch (e: any) {
    console.error(e);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
