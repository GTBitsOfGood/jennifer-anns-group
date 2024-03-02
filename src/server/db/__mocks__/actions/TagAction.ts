import { faker } from "@faker-js/faker";
import { CreateTagInput } from "@/pages/api/tags";

faker.seed(123);

function createRandomTag(games: string[]): CreateTagInput {
  //Making the tags product names
  const chosenGames = faker.helpers.arrayElements(games);
  return {
    name: faker.commerce.productName(),
    type: faker.helpers.arrayElement(["custom", "accessibility"]),
    games: chosenGames,
  };
}

export const randomTags = (games: string[], num: number) => {
  //An array of objectId's for games should be passed in.
  return Array.from({ length: num }).map(() => createRandomTag(games));
};
