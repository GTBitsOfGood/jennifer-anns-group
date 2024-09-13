import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { generateRandomNumberSequence } from "@/utils/misc";
import { verificationLogSchema, VerificationLogType } from "@/utils/types";
import VerificationLogModel, {
  IVerificationLog,
} from "../models/VerificationLogModel";
import connectMongoDB from "../mongodb";
import { VerificationLogDoesNotExistException } from "@/utils/exceptions/verificationLog";

const verificationLogCreationParams = verificationLogSchema
  .omit({ numAttemptsRemaining: true, createdAt: true })
  .extend({ numAttempts: z.number().int().optional() });
const verificationLogVerificationParams = verificationLogSchema
  .omit({
    numAttemptsRemaining: true,
    createdAt: true,
    expiresAt: true,
  })
  .extend({ decrementAttempts: z.boolean().optional() });

type VerificationLogCreationParams = z.infer<
  typeof verificationLogCreationParams
>;
type VerificationLogVerificationParams = z.infer<
  typeof verificationLogVerificationParams
>;

/**
 * Create a verification log for an email. If a verification log already exists for the email, it is deleted.
 * @param email Email of the user
 * @param token Token to be sent to the user for verification later
 * @param type Type of verification log (e.g. password reset, email verification)
 * @param expiresAt Expiry date of the token
 * @param numAttempts Number of attempts allowed to verify the token before it is deleted
 * @returns Verification log object
 */
const createVerificationLog = async ({
  email,
  token,
  type,
  expiresAt,
  numAttempts = -1,
}: VerificationLogCreationParams): Promise<IVerificationLog> => {
  await connectMongoDB();
  await VerificationLogModel.deleteMany({
    email,
    type,
  });

  const verificationLog = await VerificationLogModel.create({
    email,
    type,
    token,
    numAttemptsRemaining: numAttempts,
    expiresAt,
  });
  return verificationLog.toObject();
};

/**
 * Verify a verification log for an email. If the token is verified, the verification log is deleted.
 * If the token is incorrect and @decrementAttempts is set, the number of attempts remaining is decremented.
 * @param email Email of the user
 * @param type Type of verification log (e.g. password reset, email verification)
 * @param token Token to verify
 * @param decrementAttempts Whether to decrement the number of attempts remaining in case of incorrect token
 * @returns Whether the token is verified
 * @throws {VerificationLogDoesNotExistException} If the verification log does not exist
 */
const verifyVerificationLog = async ({
  email,
  type,
  token,
  decrementAttempts = false,
}: VerificationLogVerificationParams): Promise<boolean> => {
  await connectMongoDB();
  const passwordResetLog = await VerificationLogModel.findOne({
    email,
    type,
  });
  if (!passwordResetLog) {
    throw new VerificationLogDoesNotExistException();
  }

  if (passwordResetLog.token === token) {
    await passwordResetLog.deleteOne();
    return true;
  }

  // Password reset log exists but token provided is incorrect

  // Decrement the number of attempts remaining if the parameter is set
  // If the number of attempts remaining reaches 0, delete the verification log so that the user cannot brute-force the token
  if (decrementAttempts) {
    passwordResetLog.numAttemptsRemaining -= 1;
    if (passwordResetLog.numAttemptsRemaining === 0) {
      await passwordResetLog.deleteOne();
    } else {
      await passwordResetLog.save();
    }
  }
  return false;
};

/**
 * Create a password reset log for an email.
 * @param email Email of the user
 * @returns Verification log object
 */
export const createPasswordResetLog = async (
  email: string,
): Promise<IVerificationLog> => {
  const otp: string = generateRandomNumberSequence(6);
  const expiresAt: Date = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now
  const passwordResetLog = await createVerificationLog({
    email,
    type: VerificationLogType.PASSWORD_RESET,
    token: otp,
    numAttempts: 5,
    expiresAt,
  });
  return passwordResetLog;
};

/**
 * Verify a password reset log for an email.
 * @param email Email of the user
 * @param token Token to verify
 * @returns Whether the token is verified
 * @throws {VerificationLogDoesNotExistException} If the verification log does not exist
 */
export const verifyPasswordResetLog = async (
  email: string,
  token: string,
): Promise<boolean> => {
  return verifyVerificationLog({
    email,
    type: VerificationLogType.PASSWORD_RESET,
    token,
    decrementAttempts: true,
  });
};

/**
 * Create an email verification log for an email.
 * @param email Email of the user
 * @returns Verification log object
 */
export const createEmailVerificationLog = async (
  email: string,
): Promise<IVerificationLog> => {
  const token: string = uuidv4();
  const expiresAt: Date = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
  ); // 7 days from now
  const emailVerificationLog = await createVerificationLog({
    email,
    type: VerificationLogType.EMAIL_VERIFICATION,
    token,
    expiresAt,
  });
  return emailVerificationLog;
};

/**
 * Verify an email verification log for an email.
 * @param email Email of the user
 * @param token Token to verify
 * @returns Whether the token is verified
 * @throws {VerificationLogDoesNotExistException} If the verification log does not exist
 */
export const verifyEmailVerificationLog = async (
  email: string,
  token: string,
): Promise<boolean> => {
  return verifyVerificationLog({
    email,
    type: VerificationLogType.EMAIL_VERIFICATION,
    token,
  });
};
