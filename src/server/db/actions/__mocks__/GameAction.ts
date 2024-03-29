import { IGame } from "../../models/GameModel";
import { faker } from "@faker-js/faker";
import { NonWebGLBuilds, ExtendId, ExtendVersion } from "@/utils/types";
import mongoose from "mongoose";
let salt = 0;
function createRandomGame(): ExtendVersion<ExtendId<IGame>> {
  const appTypeValues = Object.values(NonWebGLBuilds);
  const numBuilds = faker.number.int({ min: 0, max: appTypeValues.length });
  salt++;
  return {
    __v: 0,
    _id: new mongoose.Types.ObjectId().toString(),
    themes: [],
    tags: [],
    name: faker.person.fullName() + salt.toString(),
    description: faker.lorem.paragraph(),
    webGLBuild: faker.datatype.boolean(),
    lesson: faker.internet.url(),
    parentingGuide: faker.internet.url(),
    answerKey: faker.internet.url(),
    videoTrailer: faker.internet.url(),
    builds: Array.from({ length: numBuilds }).map(() => {
      return {
        _id: new mongoose.Types.ObjectId().toString(),
        type: faker.helpers.enumValue(NonWebGLBuilds),
        link: faker.internet.url(),
        instructions: faker.lorem.paragraph(),
      };
    }),
  };
}
export const randomGames = (num: number) => {
  return Array.from({ length: num }).map(() => createRandomGame());
};
