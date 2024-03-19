import "dotenv/config";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { AdminAlreadyExistsException } from "@/utils/exceptions/admin";
import mongoose from "mongoose";
import AdminModel from "@/server/db/models/AdminModel";

const addNondeletableEmails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const email of UNDELETABLE_EMAILS) {
      const admin = { email: email };
      try {
        const existingAdmin = await AdminModel.findOne({ email: admin.email });
        if (existingAdmin) throw new AdminAlreadyExistsException();
        await AdminModel.create(admin);
        console.log(`Admin ${admin.email} has been added to database.`);
      } catch (e) {
        if (e instanceof AdminAlreadyExistsException) {
          console.log(
            `Admin ${admin.email} has already been added to database before.`,
          );
        } else {
          console.log(
            `Admin ${admin.email} could not be added to database. Please try again.`,
          );
        }
      }
    }
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  } finally {
    mongoose.connection.close();
  }
};

addNondeletableEmails();
