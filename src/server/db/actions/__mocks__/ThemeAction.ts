import { faker } from "@faker-js/faker";
import { CreateThemeInput } from "@/pages/api/themes";
import mongoose from "mongoose";
import { ExtendId } from "@/utils/types";
faker.seed(123);

function createRandomTheme(games: string[]): ExtendId<CreateThemeInput> {
  //Making the Themes Company names
  const chosenGames = faker.helpers.arrayElements(games);
  // console.log(chosenGames);
  return {
    _id: new mongoose.Types.ObjectId().toString(),
    name: faker.company.name(),
    games: chosenGames,
  };
}

export const randomThemes = (games: string[], num: number) => {
  //An array of objectId's for games should be passed in.
  return Array.from({ length: num }).map(() => createRandomTheme(games));
};
