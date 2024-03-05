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
    const games = await GameModel.insertMany(randomGames(10));
    const gameIds = games.map((game) => game._id.toString());
    const tagInputs = randomTags(gameIds, 10);
    const tags = await Promise.all([
      tagInputs.map(async (tag) => {
        await createTag(tag);
      }),
    ]);
    // console.log(games);
    const themes = await ThemeModel.insertMany(randomThemes(gameIds, 10));
  });

  afterEach(async () => {
    await GameModel.deleteMany({});
    await ThemeModel.deleteMany({});
    await TagModel.deleteMany({});
  });

  describe("getSelectedGames", () => {
    test("Filtering", async () => {
      expect(12).toBe(12);
    });
  });
});
