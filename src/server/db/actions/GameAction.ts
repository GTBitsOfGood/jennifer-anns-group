import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";

export async function createGame(data: any) {
  await connectMongoDB();
  const game = new GameModel(data);
  try {
    await game.save();
    return game._id;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
