import { z } from "zod";
import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";
import { createUserSchema } from "@/pages/api/users";
import bcrypt from "bcrypt";
import { changePWSchema, userSchema } from "@/utils/types";
// import { Error } from "mongoose";
import {
  GenericServerErrorException,
  UserAlreadyExistsException,
  UserCredentialsIncorrectException,
  UserDoesNotExistException,
  GenericUserErrorException
} from "@/utils/exceptions";
import { MongoError, MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";

const SALT_ROUNDS = 10;
const DUP_KEY_ERROR_CODE = 11000;

export async function createUser(data: z.infer<typeof createUserSchema>) {
  await connectMongoDB();

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const userData: z.infer<typeof userSchema> = {
    ...data,
    hashedPassword,
  };

  try {
    return await UserModel.create(userData);
  } catch (e: unknown) {
    let mongoErr = e as MongoError;
    if (
      mongoErr.name === "MongoServerError" &&
      mongoErr.code === DUP_KEY_ERROR_CODE
    ) {
      throw new UserAlreadyExistsException();
    }
    throw new GenericServerErrorException();
  }
}

export async function verifyUser(email: string, password: string) {
  await connectMongoDB();

  const user = await UserModel.findOne({ email: email }, { __v: 0 });
  if (!user) throw new UserDoesNotExistException();

  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) throw new UserCredentialsIncorrectException();

  const { hashedPassword, ...nonSensitiveUser } = user.toObject();

  return {
    ...nonSensitiveUser,
    _id: nonSensitiveUser._id.toString(),
  };
}

/**
 * Gets a user by their email address.
 * @param {string} email Email address of the user to get.
 * @throws {UserDoesNotExistException} If unable to find user
 */
export async function getUser(email: string) {
  await connectMongoDB();
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new UserDoesNotExistException();
  }
  return user;
}

/**
 * Edits a user.
 * @param {z.infer<typeof userSchema> & { _id: string }} userInfo Info of the user to find/update.
 * @throws {GenericUserErrorException} If changing email to an email that corresponds to a pre-existing account
 * @throws {UserDoesNotExistException} If unable to find user
 * 
 */
export async function editUser(userInfo: z.infer<typeof userSchema> & { _id: string }) {
  await connectMongoDB();

  const existingUser = await UserModel.findOne({ email: userInfo.email });
  
  if (existingUser && String(existingUser._id) != userInfo._id) {
    throw new GenericUserErrorException();
  }
  const result = await UserModel.findByIdAndUpdate(userInfo._id, userInfo, {
    new: true,
  });
  if (!result) {
    throw new UserDoesNotExistException();
  }
  return result;
}

/**
 * Edits user password.
 * @param {z.infer<typeof changePWSchema>} passwordInfo Password info of user.
 * @throws {UserDoesNotExistException} If unable to find user
 * @throws {UserCredentialsIncorrectException} If old password doesn't match user's current password
 * @throws {GenericServerErrorException} If unable to update user
 */
export async function editPassword(passwordInfo: z.infer<typeof changePWSchema>) {
  await connectMongoDB();

  const user = await UserModel.findOne({ email: passwordInfo.email });
  if (!user) {
    throw new UserDoesNotExistException();
  }

  // Compare the old password provided by the user with the hashed password stored in the database
  const oldPasswordMatch = await bcrypt.compare(passwordInfo.oldpassword, user.hashedPassword);
  if (!oldPasswordMatch) {
    throw new UserCredentialsIncorrectException();
  }

  const hashedPassword = await bcrypt.hash(passwordInfo.password, SALT_ROUNDS);

  // Update the user's password
  const updatedUser = await UserModel.findOneAndUpdate(
    { email: passwordInfo.email },
    { $set: { hashedPassword } },
    { new: true }
  );

  // Check if user was able to be found/updated
  if (!updatedUser) {
    throw new GenericServerErrorException();
  }
}