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

export async function getUser(email: string) {
  await connectMongoDB();
  try {
    const user = await UserModel.findOne({ email: email });
    return user;
  } catch (e) {
    throw e;
  }
}

export async function editUser(data: any) {
  await connectMongoDB();
  try {
    const result = await UserModel.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    if (!result) {
      throw new ReferenceError("User with given ID does not exist.");
    }
    const user = await UserModel.findById(data._id);
  } catch (e) {
    throw e;
  }
}

export async function editPassword(data: any) {
  await connectMongoDB();

  try {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      return {
        status: 404,
        message: "User does not exist",
      };
    }

    // Compare the old password provided by the user with the hashed password stored in the database
    const oldPasswordMatch = await bcrypt.compare(data.oldpassword, user.hashedPassword);
    if (!oldPasswordMatch) {
      return {
        status: 400,
        message: "Old password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Update the user's password
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: data.email },
      { $set: { hashedPassword } },
      { new: true }
    );

    // Check if user was able to be found/updated
    if (!updatedUser) {
      return {
        status: 400,
        message: "Failed to update password",
      };
    }

    return {
      status: 200,
      message: "Password updated successfully",
    };

  } catch (e) {
    throw e;
  }
}