import GameModel, { IGame } from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { FilterQuery } from "mongoose";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { editGameSchema } from "@/utils/types";
import { IGame } from "../models/GameModel";
import { GenericGameErrorException } from "@/utils/exceptions";
import { GetGameQuerySchema } from "@/pages/api/games";
import { theme } from "@chakra-ui/react";
import mongoose, { Query } from "mongoose";
import { Accessibility } from "lucide-react";

const RESULTS_PER_PAGE = 6;
export async function createGame(data: IGame) {
  await connectMongoDB();
  //Ensure every ObjectID actually represents a Document

  if (data && data.themes) {
    const themePromises = data.themes.map((theme) =>
      ThemeModel.findById(theme),
    );
    const themeResults = await Promise.all(themePromises);
    themeResults.forEach((result, index) => {
      if (!result) {
        throw new GenericGameErrorException(
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
        throw new GenericGameErrorException(
          `ObjectID ${data.tags![index]} is not a  present tag.`,
        ); //Using non-null assertion, as if condition should ensure data.tags is non-null
      }
    });
  }

  const game = new GameModel(data);
  await game.save();
  return game._id;
}

export async function deleteGame(data: ObjectId) {
  await connectMongoDB();
  try {
    const result = await GameModel.findByIdAndDelete(data.toString());
    if (result?.get("webGLBuild")) {
      await deleteBuild(data.toString());
    }
    if (!result) {
      throw new GenericGameErrorException("Game with given ID does not exist.");
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
  //Ensure every ObjectID actually represents a Document
  //Ah yes
  if (data && data.themes) {
    const themeResults = await ThemeModel.find({ id: { $in: data.themes } });
    if (themeResults.length !== data.themes.length) {
      throw new GenericGameErrorException(
        "One of the given themes does not exist.",
      ); //Using non-null assertion, as if condition should ensure data.tags is non-null
    }
  }
  if (data && data.tags) {
    const tagResults = await TagModel.find({ id: { $in: data.tags } });
    if (tagResults.length !== data.tags.length) {
      throw new GenericGameErrorException(
        "One of the given tags does not exist.",
      ); //Using non-null assertion, as if condition should ensure data.tags is non-null
    }
  }

  const result = await GameModel.findByIdAndUpdate(allData.id, allData.data, {
    new: false,
  });
  if (!result) {
    throw new GenericGameErrorException("Game with given ID does not exist.");
  }
  return result;
}
export async function getSelectedGames(
  query: z.infer<typeof GetGameQuerySchema>,
) {
  await connectMongoDB();
  //Want to be able to filter by specific tags,game_builds, etc.
  //Find the corresponding id to the Theme tag.
  let filters: FilterQuery<IGame> = {}; //There should be a better way to build the query gradually
  if (query.theme) {
    //Find corresponding themeObject in mongodb
    const found_theme: (ITheme & { id: ObjectId }) | null =
      await ThemeModel.findOne({
        name: query.theme,
      });
    if (!found_theme) {
      //No theme was found
      throw new GenericGameErrorException(
        `No theme with the name ${query.theme} exists.`,
      );
    }
    //Add to filters object
    filters.themes = { $all: [found_theme] };
    //Essentially ensures that the themes array contains found_theme.
  }
  //Find the correspoding tag ids for the accessibility TAGS.
  let accessibility: ObjectId[] = [];
  if (query.accessibility) {
    const accessibilityTags = await TagModel.find({
      name: { $in: query.accessibility },
      type: "accessibility",
    });
    //Ensure that we found all tags and no extras
    if (query.accessibility.length !== accessibilityTags.length) {
      throw new GenericGameErrorException(
        "One or more of the accessibility tags do not exist.",
      );
    }
    accessibility = accessibilityTags.map((tag) => tag.id);
  }
  let custom: ObjectId[] = [];
  if (query.tags) {
    const normalTags = await TagModel.find({
      name: { $in: query.tags },
      type: "custom",
    });
    if (query.tags.length !== normalTags.length) {
      throw new GenericGameErrorException(
        "One or more of the custom tags do not exist.",
      );
    }
    custom = normalTags.map((tag) => tag.id);
  }
  const totalTags = [...custom, ...accessibility];
  if (totalTags.length !== 0) {
    //Add to filters
    filters.tags = { $all: totalTags };
  }
  //Currently ignoring filtering by build, as that hasn't yet been implemented.

  //Match by name with regex
  if (query.name && query.name !== "") {
    const reg_string = new RegExp(query.name, "i");
    filters.name = { $regex: reg_string };
  }
  //Match by gameContent, by ensuring they all exist.
  if (query.gameContent) {
    filters = query.gameContent.reduce((acc, curr) => {
      acc[curr] = { $exists: true };
      return acc;
    }, filters);
  }
  let games = await GameModel.find(filters)
    .skip((query.page - 1) * RESULTS_PER_PAGE)
    .limit(RESULTS_PER_PAGE);

  return games;
}

export async function getGameById(id: string) {
  await connectMongoDB();
  const game = await GameModel.findById(id).populate<IGame>("themes tags");
  return game;
}
