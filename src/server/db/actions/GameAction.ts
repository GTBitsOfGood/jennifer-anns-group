import GameModel, { IBuild, IGame } from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel, { ITag } from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { FilterQuery } from "mongoose";
import { z } from "zod";
import { AllBuilds, ExtendId, editGameSchema } from "@/utils/types";
import mongoose from "mongoose";
import { GetGameQuerySchema } from "@/pages/api/games";
import {
  GameNotFoundException,
  InvalidIdGameErrorException,
  GameAlreadyExistsException,
} from "@/utils/exceptions/game";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";

export const RESULTS_PER_PAGE = 7;
export async function createGame(data: IGame) {
  await connectMongoDB();

  const existingGame = await GameModel.findOne({ name: data.name });

  if (existingGame) throw new GameAlreadyExistsException();

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
      );
    }
  }
  if (data && data.tags) {
    const tagResults = await TagModel.find({ _id: { $in: data.tags } });
    if (tagResults.length !== data.tags.length) {
      throw new InvalidIdGameErrorException(
        "One of the given tags does not exist.",
      );
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
//TODO: Refactor get selected actions to be similar to the test.
export async function getSelectedGames(
  query: z.infer<typeof GetGameQuerySchema>,
) {
  await connectMongoDB();

  let filters: FilterQuery<IGame> = {};
  const aggregate = GameModel.aggregate([]);
  if (query.theme) {
    const foundTheme = await ThemeModel.findOne({
      name: query.theme,
    });
    if (!foundTheme) {
      throw new ThemeNotFoundException(
        `No theme with the name ${query.theme} exists.`,
      );
    }
    filters.themes = { $in: [foundTheme._id] };
  }

  let totalTags: mongoose.Types.ObjectId[] = [];
  const tagTypes = [
    { tags: query.tags, type: "custom" },
    { tags: query.accessibility, type: "accessibility" },
  ];
  totalTags = await tagTypes.reduce(async (acc, curr) => {
    let accAwaited = await acc;
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
  if (totalTags.length !== 0) {
    filters.tags = { $all: totalTags };
  }

  if (query.name && query.name !== "") {
    const reg_string = new RegExp(
      "[a-zA-Z0-9_]*" + query.name + "[a-zA-Z0-9_]*",
      "i",
    );
    filters.name = { $regex: reg_string };
  }
  if (query.gameContent) {
    filters = query.gameContent.reduce((acc, curr) => {
      acc[curr] = { $exists: true };
      return acc;
    }, filters);
  }

  if (query.gameBuilds && query.gameBuilds.length !== 0) {
    if (query.gameBuilds.includes(AllBuilds.webgl)) {
      query.gameBuilds = query.gameBuilds.filter((item) => item !== "webgl");
    }

    const filterableBuilds = query.gameBuilds.map(
      (build: string) => AllBuilds[build as keyof typeof AllBuilds],
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
  }

  aggregate.match(filters);
  aggregate.sort({ name: 1 });
  aggregate.facet({
    games: [
      { $skip: (query.page - 1) * RESULTS_PER_PAGE },
      { $limit: RESULTS_PER_PAGE },
    ],
    count: [{ $count: "count" }],
  });
  const results = await aggregate.exec();

  let count = 0;
  if (results[0].count.length != 0) {
    count = results[0].count[0].count;
  }
  const games: ExtendId<
    Omit<IGame, "builds"> & { builds: ExtendId<IBuild>[] }
  >[] = results[0].games;

  if (games.length == 0) {
    throw new GameNotFoundException("No Games found at this page");
  }
  return { games: games, count: count };
}

export async function getGameById(id: string) {
  await connectMongoDB();
  try {
    const game = await GameModel.findById(id)
      .populate<{ themes: ITheme[] }>("themes")
      .populate<{ tags: ITag[] }>("tags");
    return game;
  } catch (e) {
    throw e;
  }
}
