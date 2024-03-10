import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { adminSchema } from "../../../utils/types";

export interface IAdmin extends z.infer<typeof adminSchema> {}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
});

const AdminModel =
  (mongoose.models.Admin as mongoose.Model<IAdmin>) ??
  mongoose.model("Admin", AdminSchema);

export default AdminModel;
