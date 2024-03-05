import { IGame } from "../../models/GameModel";
import { AppType } from "@/utils/types";
import { faker } from "@faker-js/faker";
faker.seed(123);
//Assuming currently no themes or tags are passed in. They will be populated in later.
function createRandomGame(): IGame {
  const appTypeValues = Object.values(AppType);
  const numBuilds = faker.number.int({ min: 0, max: appTypeValues.length });
  return {
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
