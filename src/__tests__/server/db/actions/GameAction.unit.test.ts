declare var global: any;
import mongoose, { ConnectOptions } from "mongoose";
import { randomTags } from "@/server/db/actions/__mocks__/TagAction";
import { randomThemes } from "@/server/db/actions/__mocks__/ThemeAction";
import { randomGames } from "@/server/db/actions/__mocks__/GameAction";
import { createTag } from "@/server/db/actions/TagAction";
import TagModel from "@/server/db/models/TagModel";
import ThemeModel from "@/server/db/models/ThemeModel";
import GameModel from "@/server/db/models/GameModel";
import * as connectMongoDB from "@/server/db/mongodb";
import { createTheme } from "@/server/db/actions/ThemeAction";
import { ExtendId, NonWebGLBuilds } from "@/utils/types";
import { IBuild } from "@/server/db/models/GameModel";
import {
  RESULTS_PER_PAGE,
  getSelectedGames,
} from "@/server/db/actions/GameAction";
import { IGame } from "@/server/db/models/GameModel";
import { GameContentEnum, GameQuery } from "@/pages/api/games";
import { AllBuilds } from "@/utils/types";
import { faker } from "@faker-js/faker";
import { GameNotFoundException } from "@/utils/exceptions/game";
import { TagNotFoundException } from "@/utils/exceptions/tag";
import { ThemeNotFoundException } from "@/utils/exceptions/theme";
import { CreateTagInput } from "@/pages/api/tags";
import { CreateThemeInput } from "@/pages/api/themes";
jest.mock("../../../../server/db/mongodb");
jest.spyOn(connectMongoDB, "default").mockImplementation(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
  } as ConnectOptions);
});

const NUM_GAMES = 300;
let generatedGames: ExtendId<IGame>[] = randomGames(NUM_GAMES);

const gameIds = generatedGames.map((game) => game._id.toString());
let tagInputs: ExtendId<CreateTagInput>[] = randomTags(gameIds, 10);
let themeInputs: ExtendId<CreateThemeInput>[] = randomThemes(gameIds, 10);
themeInputs.forEach((themeInput) => {
  const gameIDs = themeInput.games;
  generatedGames.forEach((game) => {
    if (gameIDs.includes(game._id)) {
      game.themes = [...(game.themes ?? []), themeInput._id];
    }
  });
});
tagInputs.forEach((tag) => {
  const gameIDs = tag.games;
  generatedGames.forEach((game) => {
    if (gameIDs.includes(game._id)) {
      game.tags = [...(game.tags ?? []), tag._id];
    }
  });
});

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
    await GameModel.insertMany(generatedGames);
    await TagModel.insertMany(tagInputs);
    await ThemeModel.insertMany(themeInputs);
  });

  afterEach(async () => {
    await GameModel.deleteMany({});
    await ThemeModel.deleteMany({});
    await TagModel.deleteMany({});
  });

  describe("getSelectedGames", () => {
    test("[pagination] page out of range: expect exception", async () => {
      const numPages = Math.ceil(NUM_GAMES / RESULTS_PER_PAGE);
      await expect(getSelectedGames({ page: numPages + 1 })).rejects.toThrow(
        GameNotFoundException,
      );
    });
    test("[pagination] no repeats in paginated results: expect success", async () => {
      const numPages = Math.ceil(NUM_GAMES / RESULTS_PER_PAGE);
      const set = new Set();
      for (let i = 0; i < numPages; i++) {
        const games = await getSelectedGames({ page: i + 1 });
        games.games.forEach((game) => {
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
        expect(games.games.length).toBe(
          i < numPages - 1
            ? RESULTS_PER_PAGE
            : NUM_GAMES - RESULTS_PER_PAGE * (numPages - 1),
        );
      }
    });
    test("[tag] nonexistent tag: expect exception", async () => {
      const tag = faker.string.numeric({ length: 40 });

      await expect(getSelectedGames({ page: 1, tags: [tag] })).rejects.toThrow(
        TagNotFoundException,
      );
    });
    test("[tag] in-out groups: expect success", async () => {
      const tag = faker.helpers.arrayElement(tagInputs);
      let query: GameQuery = {
        page: 1,
      };
      if (tag.type == "custom") {
        query.tags = [tag.name];
      } else {
        query.accessibility = [tag.name];
      }

      let games: ExtendId<IGame>[] = [];
      const numPages = Math.ceil(tag.games.length / RESULTS_PER_PAGE);
      for (let page = 1; page <= numPages; page++) {
        query.page = page;
        const result = await getSelectedGames(query);
        games = [...games, ...result.games];
      }
      const gameIds = games.map((game) => game._id.toString());
      gameIds.sort();
      tag.games.sort();
      expect(gameIds).toStrictEqual(tag.games);
    });
    test("[theme] nonexistent theme: expect exception", async () => {
      const theme = faker.string.numeric({ length: 40 });

      await expect(getSelectedGames({ page: 1, theme: theme })).rejects.toThrow(
        ThemeNotFoundException,
      );
    });
    test("[theme] in-out groups: expect success", async () => {
      const theme = faker.helpers.arrayElement(themeInputs);
      let query: GameQuery = {
        page: 1,
        theme: theme.name,
      };
      let games: ExtendId<IGame>[] = [];
      const numPages = Math.ceil(theme.games.length / RESULTS_PER_PAGE);
      for (let page = 1; page <= numPages; page++) {
        query.page = page;
        const result = await getSelectedGames(query);
        games = [...games, ...result.games];
      }
      const gameIds = games.map((game) => game._id.toString());
      gameIds.sort();
      theme.games.sort();
      expect(gameIds).toStrictEqual(theme.games);
    });
    test("[name] regex case insensitivity in-exact match: expect success", async () => {
      const randomGame = faker.helpers.arrayElement(generatedGames);
      const randomName = randomGame.name;
      const substring = randomlyCapitalizeSubString(randomName);
      let results = await getSelectedGames({ name: substring, page: 1 });
      let games = results.games;
      const numPages = Math.ceil(results.count / RESULTS_PER_PAGE) - 1;
      for (let page = 2; page < 2 + numPages; page++) {
        const result = await getSelectedGames({
          name: substring,
          page: page,
        });
        games = [...games, ...result.games];
      }
      const selectedNames = games.map((game) => game.name);
      expect(selectedNames).toContain(randomName);
    });
    test("happy: expect success", async () => {
      const customTags = await TagModel.find({ type: "custom" });
      const randomCustomTag =
        customTags[Math.floor(Math.random() * customTags.length)];
      const accessibilityTags = await TagModel.find({
        type: "accessibility",
      });
      const randomAccessibilityTag =
        accessibilityTags[Math.floor(Math.random() * accessibilityTags.length)];

      const themes = await ThemeModel.find({});
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const query = {
        page: 1,
        tags: [randomCustomTag.name],
        accessibility: [randomAccessibilityTag.name],
        theme: randomTheme.name,
        name: faker.string.alpha({ length: 1 }),
        gameBuilds: [AllBuilds.amazon],
        gameContent: [GameContentEnum.parentingGuide],
      };

      const modifiedQuery = {
        ...query,
        tags: [randomCustomTag._id.toString()],
        accessibility: [randomAccessibilityTag._id.toString()],
        theme: randomTheme._id.toString(),
      };
      const expected = filterGeneratedGames(generatedGames, modifiedQuery);

      //We need to check if the length is zero because the expected action from getSelectedGames
      //if it returns nothing is to throw an error
      if (expected.length == 0) {
        await expect(getSelectedGames(query)).rejects.toThrow(
          GameNotFoundException,
        );
      } else {
        const actual: {
          games: ExtendId<
            Omit<IGame, "builds"> & { builds: (IBuild & { _id: string })[] }
          >[];
          count: number;
        } = await getSelectedGames(query);

        actual.games = actual.games.map((game) => {
          game._id = game._id.toString();
          game.themes = game.themes?.map((theme) => theme.toString());
          game.tags = game.tags?.map((tag) => tag.toString());
          game.builds = game.builds?.map((build) => {
            build._id = build._id.toString();
            return build;
          });
          return game;
        });
        expect(actual.games.length).toEqual(expected.length);
        expect(actual.games).toEqual(expected);
        console.log(
          "ACTUAL",
          actual.games.map((game) => game.webGLBuild),
        );
      }
    });
  });

  type QueryFieldHandlers<T> = {
    [K in keyof T]: (
      games: ExtendId<IGame>[],
      field: T[K],
      resultsPerPage: number,
    ) => ExtendId<IGame>[];
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
    tags: (games, customTags, _) => {
      const filteredGames = games.filter((game) => {
        if (game.tags !== undefined) {
          const result = customTags.every((tag) => game.tags!.includes(tag));
          return result;
        }
        return false;
      });
      return filteredGames;
    },
    accessibility: (games, accessibilityTags, _) =>
      games.filter((game) =>
        accessibilityTags.every((tag) => game.tags?.includes(tag)),
      ),
    theme: (games, theme, _) =>
      games.filter((game) => game.themes?.includes(theme)),
    gameBuilds: (games, gameBuilds, _) =>
      games.filter((game) => {
        const builds = game.builds?.map((build) => build.type.toString());
        return gameBuilds?.every((build) => builds?.includes(build));
      }),
    gameContent: (games, gameContent, _) =>
      games.filter((game) => gameContent.every((document) => document in game)),
  };

  function filterGeneratedGames(
    games: ExtendId<IGame>[],
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
    filteredGames = filteredGames.sort((game1, game2) =>
      game1.name.localeCompare(game2.name),
    );
    filteredGames = QUERY_FIELD_HANDLER_MAP["page"](
      filteredGames,
      page,
      RESULTS_PER_PAGE,
    );

    return filteredGames;
  }

  function randomlyCapitalizeSubString(name: string) {
    name = name
      .split(" ")
      .map((char) =>
        Math.random() > 0.5 ? char.toLowerCase() : char.toUpperCase(),
      )
      .join(" ");
    const start = faker.number.int({ min: 0, max: name.length - 2 });
    const end = faker.number.int({ min: start + 1, max: name.length });
    return name.substring(start, end);
  }
});
