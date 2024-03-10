import { ObjectId } from "mongodb";
import AdminModel, { IAdmin } from "../models/AdminModel";
import connectMongoDB from "../mongodb";

export async function createAdmin(data: IAdmin) {
  await connectMongoDB();
  //const existingGame = await GameModel.findOne({ name: data.name });
  //if (existingGame) throw new GameAlreadyExistsException();
  try {
    const game = await AdminModel.create(data);
    return game.toObject();
  } catch (e) {
    throw e;
  }
}

//delete make sure not susanne etc
export async function deleteAdmin(data: ObjectId) {
  await connectMongoDB();
  try {
    const deletedGame = await AdminModel.findByIdAndDelete(data.toString());
    //write custom exception
    if (!deletedGame) {
      throw new Error();
    }
    return deletedGame.toObject();
  } catch (e) {
    throw e;
  }
}
