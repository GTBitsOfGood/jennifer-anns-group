import { EmailData } from "@/pages/api/email";
import { EmailFailedToSendException } from "@/utils/exceptions/email";
import { HTTP_STATUS_CODE, DEV_ADMIN_CONTACT } from "@/utils/consts";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
export async function sendEmail(data: EmailData) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILSEND_KEY || "",
  });
  const sentFrom = new Sender(
    "randomemail@trial-jy7zpl93ndol5vx6.mlsender.net", //TODO: What should I be replacing this name with?
    `${data.firstName} ${data.lastName}`,
  );
  const adminContact = [new Recipient(DEV_ADMIN_CONTACT)];
  const replyBack = new Recipient(
    data.email,
    `${data.firstName} ${data.lastName}`,
  );

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(adminContact)
    .setReplyTo(replyBack)
    .setSubject(`Question about ${data.gameName}`)
    .setText(data.message);
  const result = await mailerSend.email.send(emailParams);
  if (result.statusCode < 200 || result.statusCode >= 300) {
    throw new EmailFailedToSendException();
  }
}
