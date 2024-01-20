import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { gameSchema } from "../../utils/types";

interface IGame extends z.infer<typeof gameSchema> {}

const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
});

const GameModel =
  (mongoose.models.Game as mongoose.Model<IGame>) ??
  mongoose.model("Game", GameSchema);

export default GameModel;
