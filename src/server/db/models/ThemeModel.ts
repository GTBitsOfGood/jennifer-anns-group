import mongoose, {Schema} from "mongoose";
import {z} from "zod";
import {themeSchema} from "../../../utils/types";
import { ObjectId } from "mongodb";
export interface ITheme extends z.infer<typeof themeSchema> {}

const ThemeSchema = new Schema<ITheme>({
    name: {type: String, required: true, unique: true},
    games: {type: [ObjectId], required: false},
});

const ThemeModel = (mongoose.models.Theme as mongoose.Model<ITheme>) ??
    mongoose.model("Theme",ThemeSchema);

export default ThemeModel;
