import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";
import bcrypt from "bcrypt";
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

export async function verifyUser(email: string, hashedPassword: string) {
  //Data should be username and hashed password.
    try {
    await connectMongoDB();
    } catch (e) {
      throw new Error("Unable to verify user.");
    }
    const user = await UserModel.findOne({email: email});
    
    if (!user) {
      return {
        status: 404,
        message: "User does not exist."
      }
    }
    //const match = await bcrypt.compare(password+email,user.hashedPassword); //Replace this line with a hashing algorithm when we get it.
    const match = hashedPassword === user.hashedPassword; //Temp code, will remove once start working on bcrypt.
    console.log(hashedPassword,user.hashedPassword);
    if (match) {
      return {
        status: 200,
        message: user
      };
    }else {
      return {
        status: 400,
        message: "Invalid password"
      }
    }
  } 

