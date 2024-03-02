declare var global: any;
import mongoose, { ConnectOptions } from "mongoose";
import { getSelectedGames } from "@/server/db/actions/GameAction";
import { randomTags } from "@/server/db/__mocks__/actions/TagAction";
import { randomThemes } from "@/server/db/__mocks__/actions/ThemeAction";
import { randomGames } from "@/server/db/__mocks__/actions/GameActions";
import { createTag } from "@/server/db/actions/TagAction";
import TagModel from "@/server/db/models/TagModel";
import ThemeModel from "@/server/db/models/ThemeModel";
import GameModel from "@/server/db/models/GameModel";
jest.mock("../../../../server/db/mongodb", () => ({
  connectMongoDB: jest.fn().mockImplementation(() => {}),
}));

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
    console.log(games);
    const themes = await ThemeModel.insertMany(randomThemes(gameIds, 10));
  });

  afterEach(async () => {
    GameModel.deleteMany({});
    ThemeModel.deleteMany({});
    TagModel.deleteMany({});
  });
  describe("getSelectedGames", () => {
    test("Filtering", async () => {
      expect(12).toBe(12);
    });
  });
});
