import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { tagSchema } from "../../../utils/types";
export interface ITag extends z.infer<typeof tagSchema> {}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  enum: {
    type: String,
    enum: ["Accessibility", "Custom"],
    default: "Custom",
    required: false,
  },
});

const TagModel =
  (mongoose.models.Tag as mongoose.Model<ITag>) ??
  mongoose.model("Tag", TagSchema);

export default TagModel;
