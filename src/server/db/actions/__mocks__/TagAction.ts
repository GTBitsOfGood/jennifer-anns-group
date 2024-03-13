import { faker } from "@faker-js/faker";
import { CreateTagInput } from "@/pages/api/tags";
import { ExtendId } from "@/utils/types";
import mongoose from "mongoose";
faker.seed(123);

function createRandomTag(games: string[]): ExtendId<CreateTagInput> {
  const chosenGames = faker.helpers.arrayElements(games);
  return {
    _id: new mongoose.Types.ObjectId().toString(),
    name: faker.commerce.productName(),
    type: faker.helpers.arrayElement(["custom", "accessibility"]),
    games: chosenGames,
  };
}

export const randomTags = (games: string[], num: number) => {
  return Array.from({ length: num }).map(() => createRandomTag(games));
};
