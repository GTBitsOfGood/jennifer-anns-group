import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";

export async function createGame(data: any) {
  await connectMongoDB();
  const game = new GameModel(data);
  try {
    await game.save();
    return game._id;
  } catch (e) {
    throw e;
  }
}

export async function getAllGames() {
  await connectMongoDB();
  try {
    const games = await GameModel.find();
    if (games == null) {
      return [];
    }
    return games;
  } catch (e) {
    throw e;
  }
}

export async function getGameById(id: string) {
  await connectMongoDB();
  try {
    const game = await GameModel.findById(id);
    return game;
  } catch (e) {
    throw e;
  }
}