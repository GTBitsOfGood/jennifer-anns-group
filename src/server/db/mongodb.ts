import mongoose from "mongoose";

export const uri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (e) {
    console.log(e);
  }
};

export default connectMongoDB;
