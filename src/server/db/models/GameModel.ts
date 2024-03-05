import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { buildSchema, gameSchema, AppType } from "../../../utils/types";
import { ITheme } from "./ThemeModel";
import { ITag } from "./TagModel";

export interface IGame extends z.infer<typeof gameSchema> {}
export type populatedGame = Omit<IGame, "tags" | "themes"> & {
  tags: ITag[];
} & { themes: ITheme[] };
export type populatedGameWithId = Omit<IGame, "tags" | "themes"> & {
  tags: (ITag & { _id: string })[];
  themes: (ITheme & { _id: string })[];
};

interface IBuild extends z.infer<typeof buildSchema> {}

const BuildSchema = new Schema<IBuild>({
  type: { type: String, enum: Object.values(AppType), required: true },
  link: { type: String, required: true },
  instructions: { type: String },
});

const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
  themes: {
    type: [Schema.Types.ObjectId],
    ref: "Theme",
    default: [],
    required: false,
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: "Tag",
    default: [],
    required: false,
  },
  description: { type: String, required: true },
  webGLBuild: { type: Boolean, default: false },
  builds: { type: [BuildSchema], default: [] },
  lesson: { type: String },
  parentingGuide: { type: String },
  answerKey: { type: String },
  videoTrailer: { type: String },
});

const GameModel =
  (mongoose.models.Game as mongoose.Model<IGame>) ?? //will need to comment this out and restart to reload the game schema
  mongoose.model("Game", GameSchema);

export default GameModel;
