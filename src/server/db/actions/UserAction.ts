import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";

export async function createUser(data: any) {
  await connectMongoDB();
  const user = new UserModel(data);
  try {
    await user.save();
  } catch (e) {
    console.log(e);
  }
  return user._id;
}
