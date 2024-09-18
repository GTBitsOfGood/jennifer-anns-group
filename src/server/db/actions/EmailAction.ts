import { ContactData } from "@/pages/api/email";
import { getUser } from "../../../server/db/actions/UserAction";
import { EmailFailedToSendException } from "@/utils/exceptions/email";
import { DEV_ADMIN_CONTACT } from "@/utils/consts";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { MAIL_SEND_DOMAIN } from "@/utils/consts";

export async function sendEmail(data: ContactData) {
  //Call user endpoint to get firstName, lastName, and email

  const user = await getUser(data.userId); //This should def have a type

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILSEND_KEY || "",
  });
  const sentFrom = new Sender(
    `randomemail@${MAIL_SEND_DOMAIN}`,
    `${user.firstName} ${user.lastName}`,
  );
  const adminContact = [new Recipient(DEV_ADMIN_CONTACT)];
  const replyBack = new Recipient(
    user.email,
    `${user.firstName} ${user.lastName}`,
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
