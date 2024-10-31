import { ContactData } from "@/pages/api/email";
import { getUser } from "../../../server/db/actions/UserAction";
import { EmailFailedToSendException } from "@/utils/exceptions/email";
import { DEV_ADMIN_CONTACT } from "@/utils/consts";
import passwordResetEmailTemplate from "@/server/email-templates/passwordResetEmailTemplate";
import emailVerificationEmailTemplate from "@/server/email-templates/emailVerificationEmailTemplate";
import { EmailRecipient, EmailSender } from "juno-sdk/internal/api";
import { junoEmailClient } from "@/server/juno/init";
import { IUser } from "../models/UserModel";

export async function sendContactEmail(data: ContactData) {
  //Call user endpoint to get firstName, lastName, and email
  const user = await getUser(data.userId); //This should def have a type

  const sender: EmailSender = {
    email: process.env.JUNO_EMAIL_SENDER_EMAIL ?? "hello@bitsofgood.org",
    name: process.env.JUNO_EMAIL_SENDER_NAME ?? "Jennifer Ann's Group",
  };
  const adminContact: EmailRecipient[] = [DEV_ADMIN_CONTACT];

  // TODO: Uncomment this when reply to feature is implemented in juno
  // const replyTo: EmailReceipient[] = [{
  //   email: user.email,
  //   name: `${user.firstName} ${user.lastName}`,
  // }];

  const res = await junoEmailClient.sendEmail({
    sender,
    recipients: adminContact,
    cc: [],
    bcc: [],
    // replyTo,
    subject: `Question about ${data.gameName}`,
    contents: [
      {
        type: "text/plain",
        value: data.message,
      },
    ],
  });

  if (!res.success) {
    throw new EmailFailedToSendException();
  }
}

export async function sendPasswordResetEmail(user: IUser, otpCode: string) {
  const sender: EmailSender = {
    email: process.env.JUNO_EMAIL_SENDER_EMAIL ?? "hello@bitsofgood.org",
    name: process.env.JUNO_EMAIL_SENDER_NAME ?? "Jennifer Ann's Group",
  };

  const res = await junoEmailClient.sendEmail({
    sender,
    recipients: [
      {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    ],
    cc: [],
    bcc: [],
    // replyTo,
    subject: "Reset Your Password",
    contents: [
      {
        type: "text/html",
        value: passwordResetEmailTemplate(user.email, otpCode),
      },
    ],
  });

  if (!res.success) {
    throw new EmailFailedToSendException();
  }
}

export async function sendEmailVerificationEmail(
  email: string,
  otpCode: string,
) {
  const sender: EmailSender = {
    email: process.env.JUNO_EMAIL_SENDER_EMAIL ?? "hello@bitsofgood.org",
    name: process.env.JUNO_EMAIL_SENDER_NAME ?? "Jennifer Ann's Group",
  };

  const res = await junoEmailClient.sendEmail({
    sender,
    recipients: [
      {
        name: "New User",
        email: email,
      },
    ],
    cc: [],
    bcc: [],
    // replyTo,
    subject: "Verify Your Email",
    contents: [
      {
        type: "text/html",
        value: emailVerificationEmailTemplate(email, otpCode),
      },
    ],
  });

  if (!res.success) {
    throw new EmailFailedToSendException();
  }
}
