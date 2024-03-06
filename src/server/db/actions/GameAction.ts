import GameModel, { IGame } from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel, { ITag } from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { FilterQuery } from "mongoose";
import { z } from "zod";
import { editGameSchema } from "@/utils/types";
import mongoose from "mongoose";
import { GetGameQuerySchema, GameBuildsEnum } from "@/pages/api/games";
import {
  GameNotFoundException,
  InvalidIdGameErrorException,
  GameAlreadyExistsException,
} from "@/utils/exceptions/game";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";

export const RESULTS_PER_PAGE = 7;

export const buildConverter: { [key: string]: string } = {
  amazon: "Amazon App",
  android: "Android App",
  appstore: "App Store",
  linux: "Linux Download",
  mac: "Mac Download",
  windows: "windows",
};
export async function createGame(data: IGame) {
  await connectMongoDB();

  const existingGame = await GameModel.findOne({ name: data.name });

  if (existingGame) throw new GameAlreadyExistsException();

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

  // create the game
  try {
    const game = await GameModel.create(data);
    return game.toObject();
  } catch (e) {
    throw e;
  }
}

export async function deleteGame(data: mongoose.Types.ObjectId) {
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
  if (data && data.themes) {
    const themeResults = await ThemeModel.find({ _id: { $in: data.themes } });
    if (themeResults.length !== data.themes.length) {
      throw new InvalidIdGameErrorException(
        "One of the given themes does not exist.",
      ); //Using non-null assertion, as if condition should ensure data.tags is non-null
    }
  }
  if (data && data.tags) {
    const tagResults = await TagModel.find({ _id: { $in: data.tags } });
    if (tagResults.length !== data.tags.length) {
      throw new InvalidIdGameErrorException(
        "One of the given tags does not exist.",
      ); //Using non-null assertion, as if condition should ensure data.tags is non-null
    }
  }

  const newGame = await GameModel.findByIdAndUpdate(allData.id, allData.data, {
    new: true,
  });
  if (!newGame) {
    throw new GameNotFoundException();
  }
  return newGame;
}
export async function getSelectedGames(
  query: z.infer<typeof GetGameQuerySchema>,
) {
  await connectMongoDB();
  //Want to be able to filter by specific tags,game_builds, etc.
  //Find the corresponding id to the Theme tag.
  let filters: FilterQuery<IGame> = {};
  const aggregate = GameModel.aggregate([]);
  if (query.theme) {
    //Find corresponding themeObject in mongodb
    const foundTheme = await ThemeModel.findOne({
      name: query.theme,
    });
    if (!foundTheme) {
      //No theme was found
      throw new ThemeNotFoundException(
        `No theme with the name ${query.theme} exists.`,
      );
    }
    //Add to filters object
    filters.themes = { $in: [foundTheme._id] };
    //Essentially ensures that the themes array contains foundTheme.
  }
  //For Accessibility and normal Tags, add it to the filter object using reduce.
  //Find the correspoding tag ids for the accessibility TAGS.
  //Combine the accessibility and custom section via array.reduce=make an array that
  let totalTags: mongoose.Types.ObjectId[] = [];
  const tagTypes = [
    { tags: query.tags, type: "custom" },
    { tags: query.accessibility, type: "accessibility" },
  ];
  totalTags = await tagTypes.reduce(async (acc, curr) => {
    //curr will be tuple containing an array of tag names, and the type it has to be
    let accAwaited = await acc; //Necessary cuz we defined the accumulate as a promise.
    if (curr.tags) {
      const currTags = await TagModel.find({
        name: { $in: curr.tags },
        type: curr.type,
      });
      if (currTags.length !== curr.tags.length) {
        throw new TagNotFoundException(
          `One or more of the ${curr.type} tags do not exist.`,
        );
      }
      const currTagsId = currTags.map((tag) => tag._id);
      accAwaited = [...accAwaited, ...currTagsId];
    }
    return accAwaited;
  }, Promise.resolve(totalTags));
  //const totalTags = [...custom, ...accessibility];
  if (totalTags.length !== 0) {
    //Add to filters
    filters.tags = { $all: totalTags };
  }
  //Currently ignoring filtering by build, as that hasn't yet been implemented.

  //Match by name with regex
  if (query.name && query.name !== "") {
    const reg_string = new RegExp(
      "[a-zA-Z0-9_]*" + query.name + "[a-zA-Z0-9_]*", //Can't use /w* because prettier doesn't like it.
      "i",
    );
    filters.name = { $regex: reg_string };
  }
  //Match by gameContent, by ensuring they all exist.
  if (query.gameContent) {
    filters = query.gameContent.reduce((acc, curr) => {
      acc[curr] = { $exists: true };
      return acc;
    }, filters);
  }

  //Filtering based on game build (filtering should be add)
  if (query.gameBuilds && query.gameBuilds.length !== 0) {
    if (query.gameBuilds.includes(GameBuildsEnum.webgl)) {
      //WebGl requires a different type of filter, as it is seperate from the other builds
      filters.webGLBuild = true;
      //Remove webGL for further filtering based on other normal games.
      query.gameBuilds = query.gameBuilds.filter((item) => item !== "webgl");
    }
    //Right now picks where at least one type is included, not all types.
    //Add directly to aggregate pipeline. Transform it then unwind it back.
    //Converts AppType to field used in filter.

    const filterableBuilds = query.gameBuilds.map(
      (build: string) => buildConverter[build],
    );
    aggregate.addFields({
      types: {
        $map: {
          input: "$builds",
          as: "buildGame",
          in: "$$buildGame.type",
        },
      },
    });
    aggregate.match({ types: { $all: filterableBuilds } });
    aggregate.project({ types: 0 });
    //aggregate.match({ types: { $all: query.gameBuilds } });
    //I need builds to contain several builds, all of which have types which should be in query.gameBuilds.
  }
  //Need to add extra filtering outside of GameModel.find for
  aggregate.match(filters);
  aggregate.skip((query.page - 1) * RESULTS_PER_PAGE);
  aggregate.limit(RESULTS_PER_PAGE);
  const games: IGame[] = await aggregate.exec(); //While aggregate can return any type, I remove and add fields.
  return games;
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
