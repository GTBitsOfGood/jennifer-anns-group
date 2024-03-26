import {
  editHomePageSchema,
  gameBoySchema,
  homePageSchema,
} from "../../../utils/types";
import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export interface IGameBoy extends z.infer<typeof gameBoySchema> {}
export interface IHomePage extends z.infer<typeof homePageSchema> {}
export interface IEditHomePage extends z.infer<typeof editHomePageSchema> {}

const GameBoySchema = new Schema<IGameBoy>({
  gameId: { type: Schema.Types.ObjectId, ref: "Game" },
  description: { type: String, required: true },
});

const HomePageSchema = new Schema<IHomePage>({
  mdTitle: { type: String, required: true },
  mdDescription: { type: String, required: true },
  gameBoyTitle: { type: String, required: true },
  gameBoys: { type: [GameBoySchema], required: true },
  singleton: { type: Boolean, default: true, unique: true },
});

const HomePageModel =
  (mongoose.models.HomePage as mongoose.Model<IHomePage>) ??
  mongoose.model("HomePage", HomePageSchema);

export default HomePageModel;
