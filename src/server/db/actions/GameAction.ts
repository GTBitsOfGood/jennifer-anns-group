import GameModel from "../models/GameModel";
import connectMongoDB from "../mongodb";
import { deleteBuild } from "./BuildAction";

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

export async function deleteGame(data: any) {
  await connectMongoDB();
  try {
    const result = await GameModel.findByIdAndDelete(data);
    if (result?.get("webGLBuild")) {
      await deleteBuild(data);
    }
    if (!result) {
      throw new ReferenceError("Game with given ID does not exist.");
    }
  } catch (e) {
    throw e;
  }
}

export async function editGame(data: any) {
  await connectMongoDB();
  try {
    const result = await GameModel.findByIdAndUpdate(data.id, data.data, {
      new: true,
    });
    if (!result) {
      throw new ReferenceError("Game with given ID does not exist.");
    }
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
