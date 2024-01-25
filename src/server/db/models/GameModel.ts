import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { gameSchema } from "../../../utils/types";

interface IGame extends z.infer<typeof gameSchema> {}

const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
  theme: { type: String, required: true },
  tags: { type: [String], default: [] },
  multiClass: { type: Boolean, required: true },
  description: { type: String },
  game: { type: String, required: true },
  lesson: { type: String },
  parentingGuide: { type: String },
});

const GameModel =
  (mongoose.models.Game as mongoose.Model<IGame>) ?? //will need to comment this out and restart to reload the game schema
  mongoose.model("Game", GameSchema);

export default GameModel;
