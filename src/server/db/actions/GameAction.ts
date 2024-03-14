import GameModel, { IBuild, IGame } from "../models/GameModel";
import ThemeModel, { ITheme } from "../models/ThemeModel";
import TagModel, { ITag } from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";
import { FilterQuery, Aggregate } from "mongoose";
import { z } from "zod";
import { AllBuilds, ExtendId, editGameSchema } from "@/utils/types";
import mongoose from "mongoose";

import { GameQuery, GetGameQuerySchema } from "@/pages/api/games";
import {
  GameNotFoundException,
  InvalidIdGameErrorException,
  GameAlreadyExistsException,
} from "@/utils/exceptions/game";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";
import { Filter } from "mongodb";

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

export type GetSelectedGamesOutput = ExtendId<
  Omit<IGame, "builds"> & { builds: ExtendId<IBuild>[] }
>[];

export async function getSelectedGames(
  query: z.infer<typeof GetGameQuerySchema>,
) {
  await connectMongoDB();
  return await getSelectedGamesHelper(query);
}

type QueryFieldHandlers<T> = {
  [K in keyof Omit<T, "page">]: (
    field: T[K],
    filterFieldsAnd: FilterQuery<IGame>,
    filterFieldsOr: FilterQuery<IGame>,
  ) => Promise<{
    filterFieldsAnd: FilterQuery<IGame>;
    filterFieldsOr: FilterQuery<IGame>;
  }>;
} & {
  page: (
    field: number,
    filterFieldsAnd: FilterQuery<IGame>,
    filterFieldsOr: FilterQuery<IGame>,
  ) => Aggregate<any>;
};

const QUERY_FIELD_HANDLER_MAP: QueryFieldHandlers<GameQuery> = {
  page: (pageNum, filterFieldsAnd, filterFieldsOr) => {
    const andFilters = Object.entries(filterFieldsAnd).map(([k, v]) => ({
      [k]: v,
    }));
    const orFilters = Object.entries(filterFieldsOr).map(([k, v]) => ({
      [k]: v,
    }));

    const allSteps = [
      ...andFilters,
      ...(orFilters.length > 0 ? [{ $or: orFilters }] : []),
    ];
    const aggregate = GameModel.aggregate();

    aggregate.match({
      ...(allSteps.length > 0 && { $and: allSteps }),
    });
    aggregate.sort({ name: 1 });
    aggregate.facet({
      games: [
        { $skip: (pageNum - 1) * RESULTS_PER_PAGE },
        { $limit: RESULTS_PER_PAGE },
      ],
      count: [{ $count: "count" }],
    });
    return aggregate;
  },
  theme: async (theme, filterFieldsAnd, filterFieldsOr) => {
    const foundTheme = await ThemeModel.findOne({
      name: theme,
    });
    if (!foundTheme) {
      throw new ThemeNotFoundException(
        `No theme with the name ${theme} exists.`,
      );
    }
    filterFieldsAnd.themes = { $in: [foundTheme._id] };
    return { filterFieldsAnd: filterFieldsAnd, filterFieldsOr: filterFieldsOr };
  },
  name: async (name, filterFieldsAnd, filterFieldsOr) => {
    if (name !== undefined) {
      const reg_string = new RegExp(
        "[a-zA-Z0-9_]*" + name + "[a-zA-Z0-9_]*",
        "i",
      );
      filterFieldsAnd.name = { $regex: reg_string };
    }
    return { filterFieldsAnd: filterFieldsAnd, filterFieldsOr: filterFieldsOr };
  },
  gameBuilds: async (gameBuilds, filterFieldsAnd, filterFieldsOr) => {
    if (gameBuilds !== undefined && gameBuilds.length !== 0) {
      const nonWebGLBuilds = gameBuilds.filter(
        (build) => build !== AllBuilds.webgl,
      );

      filterFieldsOr["builds.type"] = {
        $in: nonWebGLBuilds,
      };

      if (gameBuilds.includes(AllBuilds.webgl)) {
        filterFieldsOr.webGLBuild = true;
      }
    }
    return { filterFieldsAnd: filterFieldsAnd, filterFieldsOr: filterFieldsOr };
  },
  gameContent: async (gameContent, filterFieldsAnd, filterFieldsOr) => {
    if (gameContent) {
      filterFieldsAnd = gameContent.reduce((acc, curr) => {
        acc[curr] = { $exists: true };
        return acc;
      }, filterFieldsAnd);
    }
    return {
      filterFieldsAnd: filterFieldsAnd,
      filterFieldsOr: filterFieldsOr,
    };
  },
  tags: async (tags, filterFieldsAnd, filterFieldsOr) => {
    if (tags) {
      const currTags = await TagModel.find({
        name: { $in: tags },
        type: "custom",
      });
      if (currTags.length !== tags.length) {
        throw new TagNotFoundException(
          `One or more of the custom tags do not exist.`,
        );
      }
      const currTagsId = currTags.map((tag) => tag._id);
      if (currTagsId.length !== 0) {
        filterFieldsAnd.tags = {
          $all: currTagsId.concat(filterFieldsAnd.tags?.["$all"] ?? []),
        };
      }
    }
    return {
      filterFieldsAnd: filterFieldsAnd,
      filterFieldsOr: filterFieldsOr,
    };
  },
  accessibility: async (tags, filterFieldsAnd, filterFieldsOr) => {
    if (tags) {
      const currTags = await TagModel.find({
        name: { $in: tags },
        type: "accessibility",
      });
      if (currTags.length !== tags.length) {
        throw new TagNotFoundException(
          `One or more of the accessibility tags do not exist.`,
        );
      }
      const currTagsId = currTags.map((tag) => tag._id);
      if (currTagsId.length !== 0) {
        filterFieldsAnd.tags = {
          $all: currTagsId.concat(filterFieldsAnd.tags?.["$all"] ?? []),
        };
      }
    }
    return {
      filterFieldsAnd: filterFieldsAnd,
      filterFieldsOr: filterFieldsOr,
    };
  },
};

async function getSelectedGamesHelper(query: GameQuery) {
  const { page, ...filterSteps } = query;
  let initialFilterAnd: FilterQuery<IGame> = {};
  let initialFilterOr: FilterQuery<IGame> = {};
  for (const [key, value] of Object.entries(filterSteps)) {
    const handler = QUERY_FIELD_HANDLER_MAP[key as keyof typeof filterSteps];
    if (handler) {
      const result = await handler(
        value as any,
        initialFilterAnd,
        initialFilterOr,
      );

      initialFilterAnd = result.filterFieldsAnd;
      initialFilterOr = result.filterFieldsOr;
    }
  }
  const aggregate = QUERY_FIELD_HANDLER_MAP["page"](
    page,
    initialFilterAnd,
    initialFilterOr,
  );
  const results = await aggregate.exec();
  let count = 0;
  if (results[0].count.length !== 0) {
    count = results[0].count[0].count;
  }
  const games: GetSelectedGamesOutput = results[0].games;

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
