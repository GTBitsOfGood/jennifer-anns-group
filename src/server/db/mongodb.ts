import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export const uri = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    mongoose.connect(uri);
  } catch (e) {
    console.log(e);
  }
};

export default connectMongoDB;
