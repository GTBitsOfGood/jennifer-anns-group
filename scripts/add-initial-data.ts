import "dotenv/config";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { AdminAlreadyExistsException } from "@/utils/exceptions/admin";
import mongoose from "mongoose";
import AdminModel from "@/server/db/models/AdminModel";
import HomePageModel from "@/server/db/models/HomePageModel";

const addNondeletableEmails = async () => {
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
        console.log(e);
      }
    }
  }
};

const addGameboyData = async () => {
  const gameBoy = {
    mdTitle: "Title",
    mdDescription: "**Description**",
    gameBoyTitle: "Gameboys",
    gameBoys: [
      {
        description: "Description of Game 1",
      },
      {
        description: "Description of Game 2",
      },
      {
        description: "Description of Game 3",
      },
    ],
    singleton: true,
  };
  try {
    await HomePageModel.create(gameBoy);
    console.log("Gameboy data has been added to database.");
  } catch (e) {
    console.log(
      "Gameboy data either could not be added to database or is already there. Please try again.",
    );
  }
};

const addAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // add emails admins cannot delete from database
    await addNondeletableEmails();
    // add data for gameboys in home page
    await addGameboyData();
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  } finally {
    mongoose.connection.close();
  }
};

addAllData();
