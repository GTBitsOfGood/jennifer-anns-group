import GameModel from "../../server/models/Games";
import connectMongoDB from "../../server/mongodb";

export async function createGame(data: any) {
  await connectMongoDB();
  const game = new GameModel(data);
  try {
    await game.save();
  } catch (e) {
    console.log(e);
  }
  return game._id;
}
