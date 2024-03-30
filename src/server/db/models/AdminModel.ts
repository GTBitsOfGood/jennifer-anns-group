import mongoose, { Schema } from "mongoose";
import { z } from "zod";
import { adminSchema } from "../../../utils/types";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { DeletePermanentAdminEmailException } from "@/utils/exceptions/admin";

export interface IAdmin extends z.infer<typeof adminSchema> {}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
});

AdminSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const emailToDelete = query.email;
    if (UNDELETABLE_EMAILS.includes(emailToDelete)) {
      throw new DeletePermanentAdminEmailException();
    }
    next();
  } catch (e) {
    next(e as Error);
  }
});

const AdminModel =
  (mongoose.models.Admin as mongoose.Model<IAdmin>) ??
  mongoose.model("Admin", AdminSchema);

export default AdminModel;
