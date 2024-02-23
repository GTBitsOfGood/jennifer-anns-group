import GameModel from "../models/GameModel";
import ThemeModel from "../models/ThemeModel";
import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { editGameSchema } from "@/utils/types";
import { IGame } from "../models/GameModel";
import { GenericUserErrorException } from "@/utils/exceptions";

export async function createGame(data: IGame) {
  await connectMongoDB();
  try {
    //Ensure every ObjectID actually represents a Document

    if (data && data.themes) {
      const themePromises = data.themes.map((theme) =>
        ThemeModel.findById(theme),
      );
      const themeResults = await Promise.all(themePromises);
      themeResults.forEach((result, index) => {
        if (!result) {
          throw new GenericUserErrorException(
            `ObjectID ${data.themes![index]} not a present theme.`,
          ); //Using non-null assertion, as if condition should ensure data.tags is non-null
        }
      });
    }
    if (data && data.tags) {
      const tagPromises = data.tags.map((tag) => TagModel.findById(tag));
      const tagResults = await Promise.all(tagPromises);
      tagResults.forEach((result, index) => {
        if (!result) {
          throw new GenericUserErrorException(
            `ObjectID ${data.tags![index]} is not a  present tag.`,
          ); //Using non-null assertion, as if condition should ensure data.tags is non-null
        }
      });
    }
  } catch (e) {
    throw e;
  }
  const game = new GameModel(data);
  try {
    await game.save();
    return game._id;
  } catch (e) {
    throw e;
  }
}

export async function deleteGame(data: ObjectId) {
  await connectMongoDB();
  try {
    const result = await GameModel.findByIdAndDelete(data.toString());
    if (result?.get("webGLBuild")) {
      await deleteBuild(data);
    }
    if (!result) {
      throw new GenericUserErrorException("Game with given ID does not exist.");
    }
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
  //Don't modify until sure of how data is used in the API
  await connectMongoDB();
  const data: IEditGame = allData.data;
  try {
    //Ensure every ObjectID actually represents a Document
    //Ah yes
    if (data && data.themes) {
      const themePromises = data.themes.map((theme) =>
        ThemeModel.findById(theme),
      );
      const themeResults = await Promise.all(themePromises);
      themeResults.forEach((result, index) => {
        if (!result) {
          throw new GenericUserErrorException(
            `ObjectID ${data.themes![index]} not a present theme.`,
          ); //Using non-null assertion, as if condition should ensure data.tags is non-null
        }
      });
    }
    if (data && data.tags) {
      const tagPromises = data.tags.map((tag) => TagModel.findById(tag));
      const tagResults = await Promise.all(tagPromises);
      tagResults.forEach((result, index) => {
        if (!result) {
          throw new GenericUserErrorException(
            `ObjectID ${data.tags![index]} is not a  present tag.`,
          ); //Using non-null assertion, as if condition should ensure data.tags is non-null
        }
      });
    }
  } catch (e) {
    throw e;
  }
  try {
    const result = await GameModel.findByIdAndUpdate(allData.id, allData.data, {
      new: false,
    });
    if (!result) {
      throw new GenericUserErrorException("Game with given ID does not exist.");
    }
    return result;
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
      .populate("themes")
      .populate("tags");
    return game;
  } catch (e) {
    throw e;
  }
}
