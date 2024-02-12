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