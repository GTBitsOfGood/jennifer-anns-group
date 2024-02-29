import ThemeModel from "../models/ThemeModel";
import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";
import { CreateThemeInput } from "@/pages/api/themes";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";

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
      }
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
  const session = await ThemeModel.startSession();
  session.startTransaction();
  try {
    const deletedTheme = await ThemeModel.findByIdAndDelete(id.toString()); //To fix BSON Error

    if (!deletedTheme) {
      throw new ThemeNotFoundException();
    }

    const results = await GameModel.updateMany(
      { themes: { $in: [id] } },
      { $pull: { themes: id } }
    );
    await session.commitTransaction();
    return deletedTheme;
  } catch (e) {
    await session.abortTransaction();
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
