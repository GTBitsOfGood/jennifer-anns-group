import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { gameSchema } from "../../../utils/types";
export interface IGame extends z.infer<typeof gameSchema> {}
//You must use mongoose.Schema.Types.ObjectId when defining Schemas that contain an ObjectId.
const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
  themes: {
    type: [Schema.Types.ObjectId],
    ref: "Theme",
    required: false,
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: "Tag",
    default: [],
    required: false,
  },
  description: { type: String, required: true },
  game: { type: String, required: true },
  lesson: { type: String },
  parentingGuide: { type: String },
  answerKey: { type: String },
  videoTrailer: { type: String },
});

const GameModel =
  (mongoose.models.Game as mongoose.Model<IGame>) ?? //will need to comment this out and restart to reload the game schema
  mongoose.model("Game", GameSchema);

export default GameModel;
