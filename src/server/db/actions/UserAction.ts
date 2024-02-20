import { z } from "zod";
import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";
import { createUserSchema } from "@/pages/api/users";
import bcrypt from "bcrypt";
import { userSchema } from "@/utils/types";
// import { Error } from "mongoose";
import {
  GenericServerErrorException,
  UserAlreadyExistsException,
  UserCredentialsIncorrectException,
  UserDoesNotExistException,
} from "@/utils/exceptions";
import { MongoError } from "mongodb";

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
