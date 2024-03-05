import { faker } from "@faker-js/faker";
import { CreateThemeInput } from "@/pages/api/themes";

faker.seed(123);

function createRandomTheme(games: string[]): CreateThemeInput {
  //Making the Themes Company names
  const chosenGames = faker.helpers.arrayElements(games);
  // console.log(chosenGames);
  return {
    name: faker.company.name(),
    games: chosenGames,
  };
}

export const randomThemes = (games: string[], num: number) => {
  //An array of objectId's for games should be passed in.
  return Array.from({ length: num }).map(() => createRandomTheme(games));
};
