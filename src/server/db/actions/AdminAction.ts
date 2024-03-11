import { ObjectId } from "mongodb";
import AdminModel, { IAdmin } from "../models/AdminModel";
import connectMongoDB from "../mongodb";
import {
  AdminAlreadyExistsException,
  AdminDoesNotExistException,
} from "@/utils/exceptions/admin";

export async function createAdmin(data: IAdmin) {
  await connectMongoDB();
  const existingAdmin = await AdminModel.findOne({ email: data.email });
  if (existingAdmin) throw new AdminAlreadyExistsException();
  try {
    const game = await AdminModel.create(data);
    return game.toObject();
  } catch (e) {
    throw e;
  }
}

export async function deleteAdmin(data: ObjectId) {
  await connectMongoDB();
  try {
    const admin = await AdminModel.findById(data);
    if (!admin) {
      throw new AdminDoesNotExistException();
    }
    const deletedGame = await AdminModel.findOneAndDelete({
      email: admin.email,
    });
    if (!deletedGame) {
      throw new AdminDoesNotExistException();
    }
    return deletedGame.toObject();
  } catch (e) {
    throw e;
  }
}

export async function getAdminByEmail(email: string) {
  await connectMongoDB();
  try {
    const admin = await AdminModel.findOne({ email: email });
    return admin ? admin : {};
  } catch (e) {
    throw e;
  }
}
