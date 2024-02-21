import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { buildSchema, gameSchema, AppType } from "../../../utils/types";
import { ObjectId } from "mongodb";

interface IBuild extends z.infer<typeof buildSchema> {}
interface IGame extends z.infer<typeof gameSchema> {}

const BuildSchema = new Schema<IBuild>({
  type: { type: String, enum: Object.values(AppType), required: true },
  link: { type: String, required: true },
  instructions: { type: String },
});

const GameSchema = new Schema<IGame>({
  name: { type: String, required: true, unique: true },
  theme: { type: String, required: true },
  tags: { type: [String], default: [] },
  multiClass: { type: Boolean, required: true },
  description: { type: String },
  webGLBuild: { type: Boolean, default: false },
  builds: { type: [BuildSchema], default: [] },
  lesson: { type: String },
  parentingGuide: { type: String },
});

const GameModel =
  (mongoose.models.Game as mongoose.Model<IGame>) ?? //will need to comment this out and restart to reload the game schema
  mongoose.model("Game", GameSchema);

export default GameModel;
