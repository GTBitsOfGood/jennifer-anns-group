import { ContactData } from "@/pages/api/email";
import { getUser } from "../../../server/db/actions/UserAction";
import { EmailFailedToSendException } from "@/utils/exceptions/email";
import { DEV_ADMIN_CONTACT } from "@/utils/consts";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { MAIL_SEND_DOMAIN } from "@/utils/consts";
import passwordResetEmailTemplate from "@/server/email-templates/passwordResetEmailTemplate";
import emailVerificationEmailTemplate from "@/server/email-templates/emailVerificationEmailTemplate";

export async function sendEmail(emailParams: EmailParams) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILSEND_KEY || "",
  });

  const result = await mailerSend.email.send(emailParams);
  if (result.statusCode < 200 || result.statusCode >= 300) {
    throw new EmailFailedToSendException();
  }
  return result;
}

export async function sendContactEmail(data: ContactData) {
  //Call user endpoint to get firstName, lastName, and email
  const user = await getUser(data.userId); //This should def have a type

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

  await sendEmail(emailParams);
}

export async function sendPasswordResetEmail(email: string, otpCode: string) {
  const sentFrom = new Sender(
    `randomemail@${MAIL_SEND_DOMAIN}`,
    "Jennifer Ann's Group",
  );

  if (!process.env.PASSWORD_RESET_TEMPLATE_ID) {
    throw new Error("Password Reset Template Id not set");
  }

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo([new Recipient(email)])
    .setSubject("Reset Your Password")
    .setHtml(passwordResetEmailTemplate(email, otpCode));

  await sendEmail(emailParams);
}

export async function sendEmailVerificationEmail(
  email: string,
  otpCode: string,
) {
  const sentFrom = new Sender(
    `randomemail@${MAIL_SEND_DOMAIN}`,
    "Jennifer Ann's Group",
  );

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo([new Recipient(email)])
    .setSubject("Verify Your Email")
    .setHtml(emailVerificationEmailTemplate(email, otpCode));

  await sendEmail(emailParams);
}
