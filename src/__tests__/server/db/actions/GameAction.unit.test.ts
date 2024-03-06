declare var global: any;
import mongoose, { ConnectOptions } from "mongoose";
import { randomTags } from "@/server/db/actions/__mocks__/TagAction";
import { randomThemes } from "@/server/db/actions/__mocks__/ThemeAction";
import {
  randomGames,
  createRandomGameQueries,
} from "@/server/db/actions/__mocks__/GameAction";
import { createTag } from "@/server/db/actions/TagAction";
import TagModel from "@/server/db/models/TagModel";
import ThemeModel from "@/server/db/models/ThemeModel";
import GameModel from "@/server/db/models/GameModel";
import * as connectMongoDB from "@/server/db/mongodb";
import { createTheme } from "@/server/db/actions/ThemeAction";
import { GameQuery } from "@/pages/api/games";
import {
  RESULTS_PER_PAGE,
  buildConverter,
  getSelectedGames,
} from "@/server/db/actions/GameAction";
import { IGame } from "@/server/db/models/GameModel";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";
jest.mock("../../../../server/db/mongodb");
jest.spyOn(connectMongoDB, "default").mockImplementation(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
  } as ConnectOptions);
});

//Only testing getSelectedGames for now
//Will directly populate games, themes and tags through mongodb

describe(" MongodDB Game - Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const games = await GameModel.insertMany(randomGames(100));
    const gameIds = games.map((game) => game._id.toString());
    const tagInputs = randomTags(gameIds, 10);
    const tags = await Promise.all(
      tagInputs.map(async (tag) => {
        return await createTag(tag);
      }),
    );
    const themeInputs = randomThemes(gameIds, 10);
    const themes = await Promise.all(
      themeInputs.map(async (theme) => {
        return await createTheme(theme);
      }),
    );
  });

  afterEach(async () => {
    await GameModel.deleteMany({});
    await ThemeModel.deleteMany({});
    await TagModel.deleteMany({});
  });

  describe("getSelectedGames", () => {
    test("Filtering", async () => {
      //Randomly create a filter.
      let queries = await createRandomGameQueries(100);
      const actualResults = await Promise.all(
        queries.map(async (query, index) => {
          const result = await getSelectedGames(query);
          return result.length;
        }),
      );
      const predictedResults = await Promise.all(
        queries.map(async (query, index) => {
          const result = await manualFilter(query);
          return result.length;
        }),
      );
      expect(actualResults).toEqual(predictedResults);
      //Based on that filter call the action.
      //Manually filter based on that filter and ensure the outputs match. Connect to the database in one of the mock functions to properly create the queries.
    });
  });
});

async function manualFilter(query: GameQuery) {
  //Carry out the filtering in javascript specifically.
  let games: IGame[] = await GameModel.find();

  //Not enough games
  if (RESULTS_PER_PAGE * (query.page - 1) > games.length) {
    return [];
  }
  //For some reason I need to use ! even though the if loops should force it being not null and defined.
  //Need to convert theme into object id for filtering.
  //Filter by theme
  if (query.theme) {
    const foundTheme = await ThemeModel.findOne({
      name: query.theme,
    });
    if (!foundTheme) {
      //No theme was found
      throw new ThemeNotFoundException(
        `No theme with the name ${query.theme} exists.`,
      );
    }

    games = games.filter((game) => {
      return game.themes && game.themes.includes(foundTheme._id.toString());
    });
  }
  //Filter by name
  if (query.name) {
    games = games.filter(
      (game) => game.name && game.name.includes(query.name!),
    );
  }
  //Need to convert tags from names into object ids for filtering.
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
  //Filter by all tags
  if (totalTags.length !== 0) {
    games = games.filter(
      (game) =>
        game.tags &&
        totalTags.every((val) => game.tags?.includes(val.toString())), //Ensures every element in query.tags is in game.tags
    );
  }

  //Filter by gameContent
  if (query.gameContent) {
    games = games.filter((game) => {
      return query.gameContent?.every((content) => content in game);
    });
  }
  //Filter by gameBuilds
  if (query.gameBuilds) {
    //Filter by webGL
    const filterBuilds = query.gameBuilds.map(
      (gameBuild) => buildConverter[gameBuild],
    );
    if ("webgl" in query.gameBuilds) {
      games = games.filter((game) => game.webGLBuild);
    }
    //Filter by other gamebuilds. games should contain every single build (it should be and)
    query.gameBuilds.forEach((gameBuild) => {
      if (gameBuild !== "webgl") {
        games = games.filter((game): boolean => {
          if (game.builds) {
            const types = game.builds.map((build) => build.type.toString());
            //Convert types to one used in query.
            return filterBuilds.every((type) => types.includes(type));
          } else {
            return false;
          }
        });
      }
    });
  }

  const startIndex = RESULTS_PER_PAGE * (query.page - 1); //Remember, arrays are zero indixed in javascript.
  const endIndex = startIndex + RESULTS_PER_PAGE;
  games = games.slice(startIndex, endIndex);
  return games;
}
