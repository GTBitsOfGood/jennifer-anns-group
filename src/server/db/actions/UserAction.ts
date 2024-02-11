import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export async function createUser(data: any) {
  await connectMongoDB();
  //Adding encryption here for making a new user.
  data.hashedPassword = await bcrypt.hash(data.hashedPassword, SALT_ROUNDS);

  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new UserModel(data);
  try {
    await user.save();
  } catch (e) {
    console.log(e);
  }
  return user._id;
}

export async function verifyUser(email: string, password: string) {
  //Data should be username and password.
  try {
    await connectMongoDB();
  } catch (e) {
    throw new Error("Unable to verify user.");
  }
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return {
      status: 404,
      message: "User does not exist.",
    };
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (match) {
    return {
      status: 200,
      message: user,
    };
  } else {
    return {
      status: 400,
      message: "Invalid password",
    };
  }

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