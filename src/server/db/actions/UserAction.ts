import UserModel from "../models/UserModel";
import connectMongoDB from "../mongodb";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;
export async function createUser(data: any) {
  await connectMongoDB();
  //Adding encryption here for making a new user.
  data.hashedPassword = await bcrypt.hash(data.hashedPassword, SALT_ROUNDS);
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
    //Temp code, will remove once start working on bcrypt.
    const match = await bcrypt.compare(hashedPassword,user.hashedPassword); //I need to rename these things. 
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

