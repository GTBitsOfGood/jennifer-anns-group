import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { noteSchema, userSchema } from "../../../utils/types";

export interface INote extends z.infer<typeof noteSchema> {}
export interface IUser extends z.infer<typeof userSchema> {}

const NoteSchema = new Schema<INote>(
  {
    date: { type: Date, required: true },
    description: { type: String, required: true },
    gameId: { type: Schema.Types.ObjectId, required: true },
  },
  { versionKey: false },
);

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  label: { type: String, required: true },
  notes: {
    type: [NoteSchema],
    default: [],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);

export default UserModel;
