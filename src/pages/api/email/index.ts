import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { EmailInvalidInputException } from "@/utils/exceptions/email";
import { contactSchema } from "@/utils/types";
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
export type ContactData = z.infer<typeof contactSchema>;
async function sendEmailHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = contactSchema.safeParse(JSON.parse(req.body)); //This data should eventually be replaced with just a message
    if (!parsedData.success) {
      throw new EmailInvalidInputException(); //May need to modify this slightly
    }
    await sendEmail(parsedData.data);
    return res.status(HTTP_STATUS_CODE.OK).send("Succesfully sent email");
  } catch (e: any) {
    console.error(e);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
