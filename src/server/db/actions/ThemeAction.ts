import ThemeModel from "../models/ThemeModel";
import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";
import { ObjectId } from "mongodb";
import { ITheme } from "../models/ThemeModel";
import { GenericUserErrorException } from "@/utils/exceptions";

//Put more of the verification in the actual API endpoint
export async function createTheme(data: ITheme) {
  connectMongoDB();
  const theme = new ThemeModel(data);
  try {
    await theme.save();
  } catch (e) {
    throw e;
  }
  return theme.id;
}

export async function deleteTheme(id: ObjectId) {
  connectMongoDB();
  try {
    const deleted_theme: (ITheme & { id: ObjectId }) | null =
      await ThemeModel.findByIdAndDelete(id.toString()); //To fix BSON Error

    if (!deleted_theme) {
      throw new GenericUserErrorException(
        "No Theme present with this ObjectID."
      );
    }

    const results = await GameModel.updateMany(
      { themes: { $in: [id] } },
      { $pull: { themes: id } }
    );
  } catch (e) {
    throw e;
  }
}
