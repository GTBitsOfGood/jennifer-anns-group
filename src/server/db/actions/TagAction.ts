import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import { ObjectId } from "mongodb";
import { ITag } from "../models/TagModel";
import GameModel from "../models/GameModel";
import { GenericUserErrorException } from "@/utils/exceptions";

export async function createTag(data: ITag) {
  connectMongoDB();

  const tag = new TagModel(data);

  try {
    await tag.save();
  } catch (e) {
    throw e;
  }
  return tag.id;
}

export async function deleteTag(id: ObjectId) {
  connectMongoDB();
  try {
    const deleted_tag: (ITag & { id: ObjectId }) | null =
      await TagModel.findByIdAndDelete(id.toString()); //To fix error with BSON
    if (!deleted_tag) {
      throw new GenericUserErrorException("No Tag present with this ObjectID.");
    }
    const results = await GameModel.updateMany(
      { tags: { $in: [id] } },
      { $pull: { tags: id } },
    );
  } catch (e) {
    throw e;
  }
}
