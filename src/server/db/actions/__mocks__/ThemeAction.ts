import { faker } from "@faker-js/faker";
import { CreateThemeInput } from "@/pages/api/themes";
import mongoose from "mongoose";
import { ExtendId } from "@/utils/types";
faker.seed(123);

function createRandomTheme(games: string[]): ExtendId<CreateThemeInput> {
  const chosenGames = faker.helpers.arrayElements(games);
  return {
    _id: new mongoose.Types.ObjectId().toString(),
    name: faker.company.name(),
    games: chosenGames,
  };
}

export const randomThemes = (games: string[], num: number) => {
  return Array.from({ length: num }).map(() => createRandomTheme(games));
};
