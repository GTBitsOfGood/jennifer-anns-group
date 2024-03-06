import GameModel, { IGame } from "../../models/GameModel";
import { AppType } from "@/utils/types";
import { faker } from "@faker-js/faker";
import { GetGameQuerySchema } from "@/pages/api/games";
import TagModel from "../../models/TagModel";
import ThemeModel from "../../models/ThemeModel";
import { ITag } from "../../models/TagModel";
import { ITheme } from "../../models/ThemeModel";
import connectMongoDB from "../../mongodb";
import { RESULTS_PER_PAGE } from "../GameAction";
import { GameQuery } from "@/pages/api/games";
faker.seed(123); //Currently have faker seed set for testing of testing.
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
//How can I easily randomly create a bunch of queries.
//I will have to limit the sizes of a lot of the objects.
export async function createRandomGameQueries(n: number) {
  await connectMongoDB();

  const games = await GameModel.find();
  const themes = await ThemeModel.find();
  const themeNames = themes.map((theme) => theme.name);
  const tags = await TagModel.find();
  const customTagNames = tags
    .filter((tag) => tag.type === "custom")
    .map((tag) => tag.name);
  const accessibilityTagNames = tags
    .filter((tag) => tag.type === "accessibility")
    .map((tag) => tag.name);
  console.log(accessibilityTagNames, "Accessibility");
  console.log(customTagNames, "custom");
  const gameNames = games.map((game) => game.name);
  const NUM_GAMES = gameNames.length;
  return Array.from({ length: n }).map(() => {
    return createRandomGameQuery(
      customTagNames,
      accessibilityTagNames,
      themeNames,
      gameNames,
    );
  });
}

function createRandomGameQuery(
  customTags: string[],
  accessibilityTags: string[],
  themes: string[],
  gameNames: string[],
): GameQuery {
  const appTypeValues = Object.values(AppType);
  const numBuilds = faker.number.int({ min: 0, max: appTypeValues.length });

  const themeName = faker.helpers.arrayElement(themes);
  const gameName = faker.helpers.arrayElement(gameNames);
  const NUM_GAMES = gameNames.length;
  const pageMax = NUM_GAMES / RESULTS_PER_PAGE + 2; //There should be page_max -1 pages that contain content, and the last potential page should be empty
  const gameContent = [
    "asnwerKey",
    "parentingGuide",
    "lessonPlan",
    "videoTrailer",
  ];
  const returnQuery: GameQuery = {
    gameBuilds: Array.from({ length: numBuilds }).map(() => {
      //Allows for repeats of builds, which we want.
      return faker.helpers.enumValue(AppType);
    }),
    page: faker.number.int({ min: 1, max: pageMax }),
    theme: themeName,
    tags: faker.helpers.arrayElements(customTags),
    accessibility: faker.helpers.arrayElements(accessibilityTags),
    //Limiting the number of gameContents chosen to ensure that the filter isn't too heavy
    gameContent: faker.helpers.arrayElements(gameContent, {
      min: 1,
      max: gameContent.length / 2,
    }),
    name: gameName,
  };
  const keys: (keyof GameQuery)[] = Object.keys(
    returnQuery,
  ) as (keyof GameQuery)[];
  //Randomly deleting some of the fields with 80% probability to ensure that the filters arent too large.
  keys.forEach((key) => {
    if (faker.datatype.boolean(0.8) && key !== "page") {
      delete returnQuery[key];
    }
  });
  //80% chance of making the page be 1, as otherwise the filter would be too "heavy".
  if (faker.datatype.boolean(0.6)) {
    returnQuery.page = 1;
  }

  return returnQuery;
}
