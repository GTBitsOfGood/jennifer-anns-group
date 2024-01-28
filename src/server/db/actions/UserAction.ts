import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";

export async function createUser(data: any) {
  await connectMongoDB();

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
