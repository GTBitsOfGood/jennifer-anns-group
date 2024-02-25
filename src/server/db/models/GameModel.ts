import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { buildSchema, gameSchema, AppType } from "../../../utils/types";
import { ITheme } from "./ThemeModel";
import { ITag } from "./TagModel";
interface IBuild extends z.infer<typeof buildSchema> {}
export interface IGame extends z.infer<typeof gameSchema> {}
//You must use mongoose.Schema.Types.ObjectId when defining Schemas that contain an ObjectId.
const BuildSchema = new Schema<IBuild>({
  type: { type: String, enum: Object.values(AppType), required: true },
  link: { type: String, required: true },
  instructions: { type: String },
});
export type populatedGame = Omit<IGame, "tags" | "themes"> & {
  tags: ITag[];
} & { themes: ITheme[] };
const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
  themes: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: false,
  },
  tags: {
    type: [Schema.Types.ObjectId],
    default: [],
    required: false,
  },
  description: { type: String, required: true },
  webGLBuild: { type: Boolean, default: false },
  builds: { type: [BuildSchema], default: [] },
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
