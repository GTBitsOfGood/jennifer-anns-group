import TagModel from "../models/TagModel";
import connectMongoDB from "../mongodb";
import GameModel from "../models/GameModel";
import { TagNotFoundException } from "@/utils/exceptions/tag";
import { CreateTagInput } from "@/pages/api/tags";

export async function createTag(data: CreateTagInput) {
  await connectMongoDB();
  const session = await TagModel.startSession();
  session.startTransaction();
  try {
    const tag = (await TagModel.create([data], { session }))[0];
    // const tag = await TagModel.create(data);
    await GameModel.updateMany(
      {
        _id: {
          $in: data.games,
        },
      },
      {
        $push: {
          tags: tag._id,
        },
      },
    );

    await session.commitTransaction();
    return tag.toObject();
  } catch (e) {
    await session.abortTransaction();
    throw e;
  }
}

export async function deleteTag(id: string) {
  await connectMongoDB();
  // const session = await TagModel.startSession();
  // session.startTransaction();
  try {
    const deletedTag = await TagModel.findByIdAndDelete(id.toString()); //To fix error with BSON
    if (!deletedTag) {
      throw new TagNotFoundException();
    }
    const results = await GameModel.updateMany(
      { tags: { $in: [id] } },
      { $pull: { tags: id } },
    );
    // await session.commitTransaction();
    return deletedTag.toObject();
  } catch (e) {
    // await session.abortTransaction();
    throw e;
  }
}

export async function getTagsByType() {
  await connectMongoDB();
  const tags = await TagModel.find({});
  return {
    accessibility: tags.filter((tag) => tag.type === "accessibility"),
    custom: tags.filter((tag) => tag.type === "custom"),
  };
}
