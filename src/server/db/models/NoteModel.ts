import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { noteSchema } from "../../../utils/types";

export interface INote extends z.infer<typeof noteSchema> {}

export const NoteSchema = new Schema<INote>(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true },
    gameId: { type: Schema.Types.ObjectId, required: true },
  },
  { versionKey: false },
);

const NoteModel =
  (mongoose.models.Note as mongoose.Model<INote>) ??
  mongoose.model("Note", NoteSchema);

export default NoteModel;
