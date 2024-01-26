import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { userSchema } from "../../../utils/types";

interface IUser extends z.infer<typeof userSchema> {}

enum Label {
  EDUCATOR,
  STUDENT, 
  PARENT
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  label: { type: String, required: true, enum: Label }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);

export default UserModel;
