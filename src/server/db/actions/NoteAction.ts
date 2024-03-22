import { ObjectId } from "mongodb";
import { INote } from "../models/NoteModel";
import UserModel, { IUser } from "../models/UserModel";
import connectMongoDB from "../mongodb";
import { Document } from "mongoose";

export async function getNotes(userId: string, gameId?: string) {
  await connectMongoDB();

  const user = await UserModel.findById(userId).populate({
    path: "notes",
    match: { gameId: gameId ? new ObjectId(gameId) : { $exists: true } },
  });

  if (!user) throw new Error("User does not exist");

  return user?.notes;
}

export async function createNote(
  data: INote,
  user: Document<unknown, {}, IUser> & IUser,
) {
  await connectMongoDB();

  user.notes.push(data);
  try {
    await user.save();
    return user.notes[0];
  } catch (e) {
    throw e;
  }
}

export async function updateNote(userId: string, noteId: string, data: INote) {
  await connectMongoDB();

  try {
    const res = await UserModel.findOneAndUpdate(
      { _id: userId, "notes._id": noteId },
      {
        $set: {
          "notes.$.date": data.date,
          "notes.$.description": data.description,
          "notes.$.gameId": data.gameId,
        },
      },
      { new: true },
    );
    return res;
  } catch (e) {
    throw e;
  }
}

export async function deleteNote(userId: string, noteId: string) {
  await connectMongoDB();

  const user = await UserModel.findById(userId);

  if (!user) throw new Error("User does not exist");

  try {
    const res = await UserModel.updateOne(
      { _id: userId },
      { $pull: { notes: { _id: noteId } } },
    );
    return res;
  } catch (e) {
    throw e;
  }
}
