import mongoose from "mongoose";

export const uri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
  } catch (e) {
    console.log(e);
  }
};

export default connectMongoDB;
