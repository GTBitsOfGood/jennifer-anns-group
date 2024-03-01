import GameModel, { IGame } from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel, { ITag } from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { editGameSchema } from "@/utils/types";
import {
  GameNotFoundException,
  InvalidIdGameErrorException,
} from "@/utils/exceptions/game";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";

export async function createGame(data: IGame) {
  await connectMongoDB();

  // add theme and tag IDs to the game
  try {
    if (data && data.themes) {
      const themePromises = data.themes.map((theme) =>
        ThemeModel.findById(theme),
      );
      const themeResults = await Promise.all(themePromises);
      themeResults.forEach((result) => {
        if (!result) {
          throw new ThemeNotFoundException();
        }
      });
    }
    if (data && data.tags) {
      const tagPromises = data.tags.map((tag) => TagModel.findById(tag));
      const tagResults = await Promise.all(tagPromises);
      tagResults.forEach((result) => {
        if (!result) {
          throw new TagNotFoundException();
        }
      });
    }
  } catch (e) {
    throw e;
  }

  console.log("DATA", data);

  // create the game
  try {
    const game = await GameModel.create(data);
    console.log("GAME", game);
    return game;
  } catch (e) {
    throw e;
  }
}

export async function deleteGame(data: ObjectId) {
  await connectMongoDB();
  try {
    const deletedGame = await GameModel.findByIdAndDelete(data.toString());
    if (!deletedGame) {
      throw new GameNotFoundException();
    }
    if (deletedGame?.webGLBuild) {
      await deleteBuild(data.toString());
    }
    return deletedGame.toObject();
  } catch (e) {
    throw e;
  }
}
interface IEditGame extends z.infer<typeof editGameSchema> {}
interface nextEditGame {
  data: IEditGame;
  id: string;
}
export async function editGame(allData: nextEditGame) {
  await connectMongoDB();
  const data: IEditGame = allData.data;
  try {
    if (data && data.themes) {
      const themeResults = await ThemeModel.find({ id: { $in: data.themes } });
      if (themeResults.length !== data.themes.length) {
        throw new InvalidIdGameErrorException(
          "One of the given themes does not exist.",
        ); //Using non-null assertion, as if condition should ensure data.tags is non-null
      }
    }
    if (data && data.tags) {
      const tagResults = await TagModel.find({ id: { $in: data.tags } });
      if (tagResults.length !== data.tags.length) {
        throw new InvalidIdGameErrorException(
          "One of the given tags does not exist.",
        ); //Using non-null assertion, as if condition should ensure data.tags is non-null
      }
    }
  } catch (e) {
    throw e;
  }
  try {
    const newGame = await GameModel.findByIdAndUpdate(
      allData.id,
      allData.data,
      {
        new: true,
      },
    );
    if (!newGame) {
      throw new GameNotFoundException();
    }
    return newGame;
  } catch (e) {
    throw e;
  }
}

export async function getAllGames() {
  await connectMongoDB();
  try {
    const games = await GameModel.find();
    if (games == null) {
      return [];
    }
    return games;
  } catch (e) {
    throw e;
  }
}

export async function getGameById(id: string) {
  await connectMongoDB();
  try {
    const game = await GameModel.findById(id)
      .populate<ITheme>("themes")
      .populate<ITag>("tags");
    return game;
  } catch (e) {
    throw e;
  }
}
