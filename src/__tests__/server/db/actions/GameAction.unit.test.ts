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
import {
  RESULTS_PER_PAGE,
  buildConverter,
  getSelectedGames,
} from "@/server/db/actions/GameAction";
import { IGame } from "@/server/db/models/GameModel";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { TagNotFoundException } from "@/utils/exceptions/tag";
import { GameContentEnum, GameQuery } from "@/pages/api/games";
import { AppType } from "@/utils/types";

jest.mock("../../../../server/db/mongodb");
jest.spyOn(connectMongoDB, "default").mockImplementation(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
  } as ConnectOptions);
});

//Only testing getSelectedGames for now
//Will directly populate games, themes and tags through mongodb

const NUM_GAMES = 500;

const generatedGames = randomGames(NUM_GAMES);

describe("MongodDB Game - Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const games = await GameModel.insertMany(generatedGames);
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
    test("[pagination] page out of range: expect exception", async () => {});
    test("[pagination] no repeats in paginated results: expect success", async () => {
      const numPages = Math.ceil(NUM_GAMES / RESULTS_PER_PAGE);
      const set = new Set();
      for (let i = 0; i < numPages; i++) {
        const games = await getSelectedGames({ page: i + 1 });
        games.forEach((game) => {
          expect(set.has(game)).toBe(false);
          set.add(game);
        });
      }
      expect(set.size).toBe(NUM_GAMES);
    });
    test("[pagination] number of results in each page: expect success", async () => {
      const numPages = Math.ceil(NUM_GAMES / RESULTS_PER_PAGE);
      for (let i = 0; i < numPages; i++) {
        const games = await getSelectedGames({ page: i + 1 });
        expect(games.length).toBe(
          i < numPages - 1
            ? RESULTS_PER_PAGE
            : NUM_GAMES - RESULTS_PER_PAGE * (numPages - 1),
        );
      }
    });
    test("[tag] nonexistent tag: expect exception", async () => {});
    test("[tag] in-out groups: expect success", async () => {});
    test("[theme] nonexistent theme: expect exception", async () => {});
    test("[theme] in-out groups: expect success", async () => {});
    test("[name] regex case insensitivity in-exact match: expect success", async () => {});
    // ...
    test("happy: expect success", async () => {
      const customTags = await TagModel.find({ type: "custom" });
      const customTagNames = customTags.map((tag) => tag.name);
      const randomCustomTag =
        customTagNames[Math.floor(Math.random() * customTagNames.length)];

      const accessibilityTags = await TagModel.find({ type: "accessibility" });
      const accessibilityTagNames = accessibilityTags.map((tag) => tag.name);
      const randomAccessibilityTag =
        accessibilityTagNames[
          Math.floor(Math.random() * accessibilityTagNames.length)
        ];

      const themes = await ThemeModel.find({});
      const themeNames = themes.map((theme) => theme.name);
      const randomTheme =
        themeNames[Math.floor(Math.random() * themeNames.length)];

      const query = {
        page: 2,
        tags: [randomCustomTag],
        accessibility: [randomAccessibilityTag],
        theme: randomTheme,
        name: "a",
        gameBuilds: [
          AppType.amazon,
          AppType.appstore,
          AppType.mac,
          AppType.webgl,
        ],
        gameContent: [GameContentEnum.parentingGuide],
      };

      const actual = await getSelectedGames(query);
      actual.forEach((game) => {
        expect(game).toHaveProperty("_id");
      });

      // ids determined at runtime, omit for assertion
      const actualOmittedId = actual.map(({ _id, ...rest }) => rest);

      const expected = filterGeneratedGames(generatedGames, query);
      console.log(expected);
      expect(actualOmittedId).toEqual(expected);
    });
  });
});

type QueryFieldHandlers<T> = {
  [K in keyof T]: (
    games: IGame[],
    field: T[K],
    resultsPerPage: number,
  ) => IGame[];
};

const QUERY_FIELD_HANDLER_MAP: QueryFieldHandlers<Required<GameQuery>> = {
  page: (games, page, resultsPerPage) => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return games.slice(startIndex, endIndex);
  },
  name: (games, name, _) =>
    games.filter((game) =>
      game.name.toLowerCase().includes(name.toLowerCase()),
    ),
  tags: (games, customTags, _) => [], //TODO: rework
  accessibility: (games, accessibilityTags, _) => [], //TODO: rework
  theme: (games, themeName, _) =>
    games.filter((game) => game.themes?.includes(themeName)),
  gameBuilds: (games, gameBuilds, _) =>
    games.filter((game) => {
      const builds = game.builds?.map((build) => build.type);
      return builds?.some((build) => gameBuilds.includes(build));
    }),
  gameContent: (games, gameContent, _) =>
    games.filter((game) => gameContent.every((document) => document in game)),
};

function filterGeneratedGames(
  games: IGame[],
  query: GameQuery,
  resultsPerPage = RESULTS_PER_PAGE,
) {
  const { page, ...filterSteps } = query;

  let filteredGames = games;
  for (const [key, value] of Object.entries(filterSteps)) {
    filteredGames = QUERY_FIELD_HANDLER_MAP[key as keyof typeof filterSteps](
      filteredGames,
      value as any,
      resultsPerPage,
    );
  }
  return filteredGames;
}
