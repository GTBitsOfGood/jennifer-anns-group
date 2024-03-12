import { IGame } from "../../models/GameModel";
import { AppType } from "@/utils/types";
import { faker } from "@faker-js/faker";

import { ExtendId } from "@/utils/types";
import mongoose from "mongoose";
function createRandomGame(): ExtendId<IGame> {
  const appTypeValues = Object.values(AppType);
  const numBuilds = faker.number.int({ min: 0, max: appTypeValues.length });
  return {
    _id: new mongoose.Types.ObjectId().toString(),
    themes: [],
    tags: [],
    name: faker.person.fullName(),
    description: faker.lorem.paragraph(),
    webGLBuild: faker.datatype.boolean(),
    lesson: faker.internet.url(),
    parentingGuide: faker.internet.url(),
    answerKey: faker.internet.url(),
    videoTrailer: faker.internet.url(),
    builds: Array.from({ length: numBuilds }).map(() => {
      //Allows for repeats of builds, which we want.
      return {
        type: faker.helpers.enumValue(AppType),
        link: faker.internet.url(),
        instructions: faker.lorem.paragraph(),
      };
    }),
  };
}
export const randomGames = (num: number) => {
  return Array.from({ length: num }).map(() => createRandomGame());
};
