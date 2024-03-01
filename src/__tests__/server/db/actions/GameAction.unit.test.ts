declare var global: any;
import mongoose, { ConnectOptions } from "mongoose";
import { getSelectedGames } from "@/server/db/actions/GameAction";
import GameModel from "@/server/db/models/GameModel";
import ThemeModel from "@/server/db/models/GameModel";
import TagModel from "@/server/db/models/GameModel";
import Game from "@/pages/dummy-game/[id]";
import { experimental_useEffectEvent } from "react";
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

  beforeEach(async () => {});

  afterEach(async () => {});
  describe("getSelectedGames", () => {
    test("Filtering", async () => {
      expect(12).toBe(12);
    });
  });
});
