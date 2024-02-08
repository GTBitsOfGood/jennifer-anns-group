import mongoose, {Schema} from "mongoose";
import {z} from "zod";
import {tagSchema} from "../../../utils/types";
import { ObjectId } from "mongodb";
interface ITag extends z.infer<typeof tagSchema> {}

const TagSchema = new Schema<ITag>({
    name: {type: String, required: true, unique: true},
    games: {type: [ObjectId], required: false},
});

const TagModel = (mongoose.models.Theme as mongoose.Model<ITag>) ??
    mongoose.model("Tag",TagSchema);

export default TagModel;
