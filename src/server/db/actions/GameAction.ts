import GameModel from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { FilterQuery } from "mongoose";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { editGameSchema } from "@/utils/types";
import { IGameAPI } from "../models/GameModel";
import { GenericUserErrorException } from "@/utils/exceptions";
import { GetGameQuerySchema } from "@/utils/types";
import { theme } from "@chakra-ui/react";
import mongoose, { Query } from "mongoose";
export async function createGame(data: IGameAPI) {
  await connectMongoDB();
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

  const game = new GameModel(data);
  await game.save();
  return game._id;
}

export async function deleteGame(data: ObjectId) {
  await connectMongoDB();
  const result = await GameModel.findByIdAndDelete(data.toString());
  if (!result) {
    throw new GenericUserErrorException("Game with given ID does not exist.");
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

  const result = await GameModel.findByIdAndUpdate(allData.id, allData.data, {
    new: false,
  });
  if (!result) {
    throw new GenericUserErrorException("Game with given ID does not exist.");
  }
  return result;
}
export async function getSelectedGames(
  query: z.infer<typeof GetGameQuerySchema>,
) {
  await connectMongoDB();
  //Want to be able to filter by specific tags,game_builds, etc.
  const RESULTS_PER_PAGE = 6;
  //Find the corresponding id to the Theme tag.
  const filters: FilterQuery<IGameAPI> = {}; //There should be a better way to build the query gradually
  if (query.theme) {
    //Find corresponding themeObject in mongodb
    const found_theme: (ITheme & { id: ObjectId }) | null =
      await ThemeModel.findOne({
        name: query.theme,
      });
    if (!found_theme) {
      //No theme was found
      throw new GenericUserErrorException(
        `No theme with the name ${query.theme} exists.`,
      );
    }
    //Add to filters object
    filters.themes = { $all: [found_theme] };
    //Essentially ensures that the themes array contains found_theme.
  }
  let total_tags: ObjectId[] = [];
  //Find the correspoding tag ids for the accessibility TAGS.
  if (query.accessibility) {
    const accessibility_tags = await TagModel.find({
      name: { $in: query.accessibility },
      type: "accessibility",
    });
    //Ensure that we found all tags and no extras
    if (query.accessibility.length !== accessibility_tags.length) {
      throw new GenericUserErrorException(
        "One or more of the accessibility tags do not exist.",
      );
    }
    //Filter used to ensure object is not null, then map converts it to an array of object ids.
    total_tags = total_tags.concat(
      accessibility_tags.filter((tag) => tag).map((tag) => tag.id),
    );
  }
  if (query.tags) {
    const normal_tags = await TagModel.find({ name: { $in: query.tags } });
    if (query.tags.length !== normal_tags.length) {
      throw new GenericUserErrorException(
        "One or more of the custom tags do not exist.",
      );
    }
    total_tags = total_tags.concat(
      normal_tags.filter((tag) => tag).map((tag) => tag.id),
    );
  }
  if (total_tags.length !== 0) {
    //Add to filters
    filters.tags = { $all: total_tags };
  }
  //Currently ignoring filtering by build, as that hasn't yet been implemented.

  //Match by name with regex
  if (query.name && query.name !== "") {
    const reg_string = new RegExp(query.name, "i");
    filters.name = { $regex: reg_string };
  }
  //Match by gameContent
  if (query.gameContent) {
    if (query.gameContent.includes("answerKey")) {
      filters.answerKey = { $exists: true };
    }
    if (query.gameContent.includes("parentingGuide")) {
      filters.parentingGuide = { $exists: true };
    }
    if (query.gameContent.includes("lessonPlan")) {
      filters.lessonPlan = { $exists: true };
    }
    if (query.gameContent.includes("videoTrailer")) {
      filters.videoTrailer = { $exists: true };
    }
  }
  let games;
  if (query.page) {
    games = await GameModel.find(filters)
      .skip((query.page - 1) * RESULTS_PER_PAGE)
      .limit(RESULTS_PER_PAGE);
  } else {
    games = await GameModel.find(filters);
  }
  return games;
}

export async function getGameById(id: string) {
  await connectMongoDB();
  const game = await GameModel.findById(id).populate("themes").populate("tags");
  return game;
}
