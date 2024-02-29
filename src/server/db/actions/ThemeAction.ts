import ThemeModel from "../models/ThemeModel";
import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";
import { ITheme } from "../models/ThemeModel";
import { GenericUserErrorException } from "@/utils/exceptions";
import { CreateThemeInput } from "@/pages/api/themes";
import { Types } from "mongoose";

export async function createTheme(data: CreateThemeInput) {
  await connectMongoDB();
  const session = await ThemeModel.startSession();
  session.startTransaction();
  try {
    const theme = (await ThemeModel.create([data], { session }))[0];
    await GameModel.updateMany(
      {
        _id: {
          $in: data.games,
        },
      },
      {
        $push: {
          themes: theme._id,
        },
      },
    );
    await session.commitTransaction();
    return theme.toObject();
  } catch (e) {
    await session.abortTransaction();
    console.log(e);
    throw e;
  }
}

export async function deleteTheme(id: string) {
  await connectMongoDB();
  try {
    const deleted_theme: (ITheme & { _id: Types.ObjectId }) | null =
      await ThemeModel.findByIdAndDelete(id.toString()); //To fix BSON Error

    if (!deleted_theme) {
      throw new GenericUserErrorException(
        "No Theme present with this ObjectID.",
      );
    }

    const results = await GameModel.updateMany(
      { themes: { $in: [id] } },
      { $pull: { themes: id } },
    );
  } catch (e) {
    throw e;
  }
}

export async function getThemes() {
  await connectMongoDB();
  const themes = await ThemeModel.find({});
  return themes.map((theme) => ({
    ...theme.toObject(),
    _id: theme._id.toString(),
  }));
}
